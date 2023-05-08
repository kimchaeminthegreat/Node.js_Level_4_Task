const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { Hates, Users, Comments } = require("../models");

// 댓글 싫어요
router.put("/:postId/comments/:commentId/hates", authMiddleware, async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { userId, nickname } = res.locals.user;

    // 해당 댓글이 존재하는지 확인
    const comment = await Comments.findOne({ where: { commentId } });
    if (!comment) {
      return res.status(404).json({ errorMessage: "댓글이 존재하지 않습니다." });
    }

    // 이미 싫어요를 눌렀는지 확인
    const isHated = await Hates.findOne({
      where: { postId, userId },
    });

    if (isHated) {
      return res.status(409).json({ errorMessage: "이미 싫어요를 눌렀습니다." });
    }

    // 싫어요 등록
    await Hates.create({
      postId,
      userId,
      nickname,
    });

    // 해당 댓글의 싫어요 개수 조회
    const hates = await Hates.findAndCountAll({
      where: { postId, commentId },
    });

    // 해당 댓글의 싫어요 개수가 5개 이상일 경우
    if (hates.count >= 5) {
      // 해당 댓글과 해당 댓글을 작성한 사용자 정보 삭제
      await Comments.destroy({ where: { commentId } });
      await Users.destroy({ where: { postId, userId: comment.userId } });
      await Hates.destroy({ where: { postId, commentId } });
    }

    return res.status(200).json({ message: "댓글에 싫어요를 등록하였습니다." });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ errorMessage: "댓글 싫어요 등록에 실패하였습니다." });
  }
});


// 댓글 싫어요 조회
router.get("/:postId/comments/:commentId/hates", authMiddleware, async (req, res) => {
    try {
      const { postId, commentId } = req.params;
      const hates = await Hates.findAll({ where: { postId, commentId } });
  
      return res.status(200).json({ hates });
    } catch (err) {
      console.log(err.message);
      return res.status(400).json({ errorMessage: "댓글 싫어요 조회에 실패하였습니다." });
    }
  });

module.exports = router;
