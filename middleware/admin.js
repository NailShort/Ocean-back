export default (req, res, next) => {
  if (req.user.role !== 1) {
    res.status(403).json({ success: false, message: '沒有權限' })
  } else {
    next()
  }
}

// 判斷 role 是不是 1 ，不是的話跳 403、沒有權限。是的話就通過
