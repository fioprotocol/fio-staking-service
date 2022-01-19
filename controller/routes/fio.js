import fioCtrl from "../api/fio";
import { checkAPIKey } from "./middle";

const route = require("express").Router();

route.get("/staking/suf", checkAPIKey , (req, res) => fioCtrl.getSUFStaking(req,res));
route.get("/staking", checkAPIKey , (req, res) => fioCtrl.getFIOStaking(req,res));

export default route;