import products from '../models/products.js'

// 新增商品
export const createProduct = async (req, res) => {
  try {
    const result = await products.create({
      userid: req.user._id,
      name: req.body.name,
      time: req.body.time,
      description: req.body.description,
      image: req.file?.path || '',
      sell: req.body.sell,
      category: req.body.category
    })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

// 取上架商品，找 sell 為 true 值的商品
export const getSellProducts = async (req, res) => {
  try {
    const result = await products.find({ sell: true }).populate('userid', 'image name')
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 取所有的商品，管理員專用
export const getAllProducts = async (req, res) => {
  try {
    const result = await products.find()
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 取單個商品，查id
export const getProduct = async (req, res) => {
  try {
    const result = await products.findById(req.params.id).populate('userid', 'image name')
    if (!result) {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(200).json({ success: true, message: '', result })
    }
  } catch (error) {
    if (error.name === 'CastError') { // id 錯誤
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

// 編輯商品
export const editProduct = async (req, res) => {
  try {
    const result = await products.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      time: req.body.time,
      description: req.body.description,
      image: req.file?.path,
      sell: req.body.sell,
      category: req.body.category
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

// 刪除商品
export const deletProduct = async (req, res) => {
  try {
    const result = await products.findByIdAndDelete(req.params.id)

    if (!result) {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(200).json({ success: true, message: '' })
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

// 取會員的商品，會員專用
export const getMemberProducts = async (req, res) => {
  try {
    const result = await products
      .find({
        userid: req.user._id
      })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}
