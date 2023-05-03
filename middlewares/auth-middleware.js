const jwt = require("jsonwebtoken");
const {Users} = require("../models");


module.exports = async (req, res, next) => {
    const { Authorization } = req.cookies;

    // authorization 쿠키가 존재하지 않았을 때를 대비함.
    // ?? : null 병합 문자열 (왼쪽의 값이 비었거나 null 일 경우 오른쪽 값으로 대체해준다.)
    const [authType, authToken] = (Authorization ?? "").split(" ");
    

    // authType === Bearer 값인 지 확인
    // authToken 검증
    if (authType !== "Bearer" || !authToken) {
        res.status(403).json({
            errorMessage: "로그인이 필요한 기능입니다."
        });
        return;
    }

    try {
        // 1. authToken 이 만료되었는 지 확인
        // 2. authToken 이 서버가 발급해준 토큰이 맞는 지 검증
        const { nickname } = jwt.verify(authToken, "customized-secret-key");
        console.log(nickname);
        // 3. authToken 에 있는 userId 에 해당하는 사용자가 실제 DB 에 존재하는 지 확인
        const user = await Users.findOne({
            where: {nickname: nickname},
            // attributes: ["userId", "nickname"],

        });
        res.locals.user = user;

        // console.log(user.userId);
        next(); // 이 미들웨어 다음으로 보낸다.

    } catch (err) {
        console.error(err.message);
        res
            .status(403)
            .json({errorMessage: "전달된 쿠키에서 오류가 발생하였습니다."});
        return;
    }
};