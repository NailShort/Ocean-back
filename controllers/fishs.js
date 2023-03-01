import fishs from '../models/fishs.js'

// 新增商品
export const createFish = async (req, res) => {
  try {
    const result = await fishs.create({
      name: req.body.name,
      egname: req.body.egname,
      stname: req.body.stname,
      danger: req.body.danger,
      food: req.body.food,
      size: req.body.size,
      description: req.body.description,
      image: req.file?.path || '',
      sell: req.body.sell,
      place: req.body.place,
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
export const getSellFishs = async (req, res) => {
  try {
    const result = await fishs.find({ sell: true })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 取所有的商品，管理員專用
export const getAllFishs = async (req, res) => {
  try {
    const result = await fishs.find()
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 取單個商品，查id
export const getFish = async (req, res) => {
  try {
    const result = await fishs.findById(req.params.id)
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
export const editFish = async (req, res) => {
  try {
    const result = await fishs.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      egname: req.body.egname,
      stname: req.body.stname,
      danger: req.body.danger,
      food: req.body.food,
      size: req.body.size,
      description: req.body.description,
      image: req.file?.path,
      sell: req.body.sell,
      place: req.body.place,
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
export const deletFish = async (req, res) => {
  try {
    const result = await fishs.findByIdAndDelete(req.params.id)

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

// 取商品分類，查id
export const getFishCategory = async (req, res) => {
  try {
    const result = await fishs.find({ category: req.query.category })
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
