import users from '../models/users.js'
import products from '../models/products.js'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  try {
    await users.create({
      account: req.body.account,
      password: req.body.password,
      email: req.body.email,
      name: req.body.name
    })
    res.status(200).json({ success: true, message: '' })
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(400).json({ success: false, message: '帳號重複' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const login = async (req, res) => {
  try {
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens.push(token)
    await req.user.save()
    res.status(200).json({
      success: true,
      message: '',
      result: {
        token,
        account: req.user.account,
        email: req.user.email,
        cart: req.user.cart.reduce((total, current) => total + current.quantity, 0),
        role: req.user.role,
        image: req.user.image
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    await req.user.save()
    res.status(200).json({ success: true, message: '' })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const extend = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex(token => token === req.token)
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens[idx] = token
    await req.user.save()
    res.status(200).json({ success: true, message: '', result: token })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const getUser = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: '',
      result: {
        account: req.user.account,
        email: req.user.email,
        name: req.user.name,
        image: req.user.image,
        cart: req.user.cart.reduce((total, current) => total + current.quantity, 0),
        role: req.user.role
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 取所有的會員，管理員專用
export const getAllUsers = async (req, res) => {
  try {
    const result = await users.find()
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 編輯會員資料
export const editUser = async (req, res) => {
  try {
    console.log(req)
    const result = await users.findByIdAndUpdate(req.user._id, {
      account: req.user.account,
      name: req.body.name,
      image: req.file?.path,
      email: req.body.email

    }, { new: true }) // upsert 當更新找不到時，建立一筆新的商品 (可加在 true, 後面)
    if (!result) {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(200).json({ success: true, message: '', result })
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else if (error.name === 'CastError') {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const editCart = async (req, res) => {
  try {
    // 找購物車有沒有此商品
    const idx = req.user.cart.findIndex(cart => cart.p_id.toString() === req.body.p_id)
    if (idx > -1) {
      // 如果有，檢查新數量是多少
      const quantity = req.user.cart[idx].quantity + parseInt(req.body.quantity)
      console.log(req.body.quantity)
      if (quantity <= 0) {
        // 如果新數量小於 0，從購物車陣列移除
        req.user.cart.splice(idx, 1)
      } else {
        // 如果新數量大於 0，修改購物車陣列數量
        req.user.cart[idx].quantity = quantity
      }
    } else {
      // 如果購物車內沒有此商品，檢查商品是否存在
      const product = await products.findById(req.body.p_id)
      // 如果不存在，回應 404
      if (!product || !product.sell) {
        res.status(404).send({ success: false, message: '找不到' })
        return
      }
      // 如果存在，加入購物車陣列
      req.user.cart.push({
        p_id: req.body.p_id,
        quantity: parseInt(req.body.quantity)
      })
    }
    await req.user.save()
    res.status(200).json({ success: true, message: '', result: req.user.cart.reduce((total, current) => total + current.quantity, 0) })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const getCart = async (req, res) => {
  try {
    const result = await users.findById(req.user._id, 'cart').populate('cart.p_id')
    res.status(200).json({ success: true, message: '', result: result.cart })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}
// 文章加入最愛 ------------------------------------------------------------
export const editLike = async (req, res) => {
  try {
    // 找購物車有沒有此商品
    const idx = req.user.like.findIndex(like => like.p_id.toString() === req.body.p_id)
    if (idx > -1) {
      // 如果有，檢查新數量是多少
      const quantity = req.user.like[idx].quantity + parseInt(req.body.quantity)
      console.log(req.body.quantity)
      if (quantity <= 0) {
        // 如果新數量小於 0，從購物車陣列移除
        req.user.like.splice(idx, 1)
      } else {
        // 如果新數量大於 0，修改購物車陣列數量
        req.user.like[idx].quantity = quantity
      }
    } else {
      // 如果購物車內沒有此商品，檢查商品是否存在
      const product = await products.findById(req.body.p_id)
      // 如果不存在，回應 404
      if (!product || !product.sell) {
        res.status(404).send({ success: false, message: '找不到' })
        return
      }
      // 如果存在，加入購物車陣列
      req.user.like.push({
        p_id: req.body.p_id,
        quantity: parseInt(req.body.quantity)
      })
    }
    await req.user.save()
    res.status(200).json({ success: true, message: '', result: req.user.like.reduce((total, current) => total + current.quantity, 0) })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const getLike = async (req, res) => {
  try {
    const result = await users.findById(req.user._id, 'like').populate('like.p_id')
    res.status(200).json({ success: true, message: '', result: result.like })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}
