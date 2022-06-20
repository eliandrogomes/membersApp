const express = require("express");
const MemberController = require("../controllers/MemberController")

var router = express.Router();

router.get("/", MemberController.listMembers);
router.post("/", MemberController.createMember);
router.get("/:memberId", MemberController.getMember);
router.put("/:memberId", MemberController.updateMember);
router.patch("/:memberId", MemberController.updatePartialMember);
router.delete("/:memberId", MemberController.removeMember);

module.exports = router;