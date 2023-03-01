import replys from '../models/replys.js'
import users from '../models/users.js'

// 新增回覆
export const createReply = async (req, res) => {
  try {
    const result = await replys.create({
      userid: req.user._id,
      description: req.body.description,
      image: req.file?.path || '',
      proid: req.body.proid
    })

    const user = await users.findById(req.user._id, 'image name')
    result.userid = user

    res.status(200).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

// 編輯商品
export const editReply = async (req, res) => {
  try {
    const result = await replys.findByIdAndUpdate(req.params.id, {
      description: req.body.description,
      image: req.file?.path
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

// 取單個商品，查id
export const getReply = async (req, res) => {
  try {
    const result = await replys.find({ proid: req.params.id }).populate('userid', 'image name')
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
