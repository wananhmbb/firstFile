//坐位体前屈
export function SittingBodyFlexion(v) {
	if (v.age <= 29) {
		if (v.sex == "男") {
			if (v.value >= 14) {
				return "优秀"
			} else if (v.value >= 8 && v.value <= 13) {
				return "很好"
			} else if (v.value >= 4 && v.value <= 7) {
				return "好"
			} else if (v.value >= -1 && v.value <= 3) {
				return "一般"
			} else if (v.value <= -2) {
				return "需改进"
			}
		} else {
			if (v.value >= 15) {
				return "优秀"
			} else if (v.value >= 11 && v.value <= 14) {
				return "很好"
			} else if (v.value >= 7 && v.value <= 10) {
				return "好"
			} else if (v.value >= -2 && v.value <= 6) {
				return "一般"
			} else if (v.value <= 1) {
				return "需改进"
			}
		}
	} else if (v.age >= 30 && v.age <= 39) {
		if (v.sex == "男") {
			if (v.value >= 12) {
				return "优秀"
			} else if (v.value >= 7 && v.value <= 11) {
				return "很好"
			} else if (v.value >= 2 && v.value <= 6) {
				return "好"
			} else if (v.value >= -3 && v.value <= 1) {
				return "一般"
			} else if (v.value <= -4) {
				return "需改进"
			}
		} else {
			if (v.value >= 15) {
				return "优秀"
			} else if (v.value >= 10 && v.value <= 14) {
				return "很好"
			} else if (v.value >= 6 && v.value <= 9) {
				return "好"
			} else if (v.value >= 1 && v.value <= 5) {
				return "一般"
			} else if (v.value <= 0) {
				return "需改进"
			}
		}
	} else if (v.age >= 40 && v.age <= 49) {
		if (v.sex == "男") {
			if (v.value >= 9) {
				return "优秀"
			} else if (v.value >= 3 && v.value <= 8) {
				return "很好"
			} else if (v.value >= -2 && v.value <= 2) {
				return "好"
			} else if (v.value >= -8 && v.value <= -3) {
				return "一般"
			} else if (v.value <= -9) {
				return "需改进"
			}
		} else {
			if (v.value >= 12) {
				return "优秀"
			} else if (v.value >= 8 && v.value <= 11) {
				return "很好"
			} else if (v.value >= 4 && v.value <= 7) {
				return "好"
			} else if (v.value >= -1 && v.value <= 3) {
				return "一般"
			} else if (v.value <= -2) {
				return "需改进"
			}
		}
	} else if (v.age >= 50 && v.age <= 59) {
		if (v.sex == "男") {
			if (v.value >= 9) {
				return "优秀"
			} else if (v.value >= 2 && v.value <= 8) {
				return "很好"
			} else if (v.value >= -2 && v.value <= 1) {
				return "好"
			} else if (v.value >= -10 && v.value <= -3) {
				return "一般"
			} else if (v.value <= -11) {
				return "需改进"
			}
		} else {
			if (v.value >= 13) {
				return "优秀"
			} else if (v.value >= 7 && v.value <= 12) {
				return "很好"
			} else if (v.value >= 4 && v.value <= 6) {
				return "好"
			} else if (v.value >= -1 && v.value <= 3) {
				return "一般"
			} else if (v.value <= -2) {
				return "需改进"
			}
		}
	} else if (v.age >= 60) {
		if (v.sex == "男") {
			if (v.value >= 7) {
				return "优秀"
			} else if (v.value >= 1 && v.value <= 6) {
				return "很好"
			} else if (v.value >= -6 && v.value <= 0) {
				return "好"
			} else if (v.value >= -11 && v.value <= -7) {
				return "一般"
			} else if (v.value <= -12) {
				return "需改进"
			}
		} else {
			if (v.value >= 9) {
				return "优秀"
			} else if (v.value >= 5 && v.value <= 8) {
				return "很好"
			} else if (v.value >= 1 && v.value <= 4) {
				return "好"
			} else if (v.value >= -3 && v.value <= 0) {
				return "一般"
			} else if (v.value <= -4) {
				return "需改进"
			}
		}
	}
}
//靠墙静蹲
export function SquatAgainstTheWall(v) {
	if (v.age <= 29) {
		if (v.sex == "男") {
			if (v.value >= 130) {
				return "高"
			} else if (v.value >= 68 && v.value <= 129) {
				return "中"
			} else if (v.value <= 67) {
				return "低"
			}
		} else {
			if (v.value >= 114) {
				return "高"
			} else if (v.value >= 51 && v.value <= 113) {
				return "中"
			} else if (v.value <= 50) {
				return "低"
			}
		}
	} else if (v.age >= 30 && v.age <= 39) {
		if (v.sex == "男") {
			if (v.value >= 133) {
				return "高"
			} else if (v.value >= 63 && v.value <= 132) {
				return "中"
			} else if (v.value <= 62) {
				return "低"
			}
		} else {
			if (v.value >= 120) {
				return "高"
			} else if (v.value >= 48 && v.value <= 119) {
				return "中"
			} else if (v.value <= 47) {
				return "低"
			}
		}
	} else if (v.age >= 40 && v.age <= 49) {
		if (v.sex == "男") {
			if (v.value >= 121) {
				return "高"
			} else if (v.value >= 56 && v.value <= 120) {
				return "中"
			} else if (v.value <= 55) {
				return "低"
			}
		} else {
			if (v.value >= 63) {
				return "高"
			} else if (v.value >= 28 && v.value <= 62) {
				return "中"
			} else if (v.value <= 27) {
				return "低"
			}
		}
	} else if (v.age >= 50 && v.age <= 59) {
		if (v.sex == "男") {
			if (v.value >= 130) {
				return "高"
			} else if (v.value >= 41 && v.value <= 129) {
				return "中"
			} else if (v.value <= 40) {
				return "低"
			}
		} else {
			if (v.value >= 60) {
				return "高"
			} else if (v.value >= 16 && v.value <= 59) {
				return "中"
			} else if (v.value <= 15) {
				return "低"
			}
		}
	} else if (v.age >= 60) {
		if (v.sex == "男") {
			if (v.value >= 65) {
				return "高"
			} else if (v.value >= 23 && v.value <= 64) {
				return "中"
			} else if (v.value <= 22) {
				return "低"
			}
		} else {
			if (v.value >= 51) {
				return "高"
			} else if (v.value >= 13 && v.value <= 50) {
				return "中"
			} else if (v.value <= 12) {
				return "低"
			}
		}
	}
}
//两分钟踏步 
export function TwoMinuteStep(v) {
	if (v.age <= 44) {
		if (v.sex == "男") {
			if (v.value > 280) {
				return "强"
			} else if (v.value >= 229 && v.value <= 280) {
				return "标准"
			} else if (v.value < 229) {
				return "弱"
			}
		} else {
			if (v.value > 265) {
				return "强"
			} else if (v.value >= 205 && v.value <= 265) {
				return "标准"
			} else if (v.value < 205) {
				return "弱"
			}
		}
	} else if (v.age >= 45 && v.age <= 49) {
		if (v.sex == "男") {
			if (v.value > 269) {
				return "强"
			} else if (v.value >= 217 && v.value <= 269) {
				return "标准"
			} else if (v.value < 217) {
				return "弱"
			}
		} else {
			if (v.value > 253) {
				return "强"
			} else if (v.value >= 193 && v.value <= 253) {
				return "标准"
			} else if (v.value < 193) {
				return "弱"
			}
		}
	} else if (v.age >= 50 && v.age <= 54) {
		if (v.sex == "男") {
			if (v.value > 255) {
				return "强"
			} else if (v.value >= 205 && v.value <= 255) {
				return "标准"
			} else if (v.value < 205) {
				return "弱"
			}
		} else {
			if (v.value > 241) {
				return "强"
			} else if (v.value >= 181 && v.value <= 241) {
				return "标准"
			} else if (v.value < 181) {
				return "弱"
			}
		}
	} else if (v.age >= 55 && v.age <= 59) {
		if (v.sex == "男") {
			if (v.value > 243) {
				return "强"
			} else if (v.value >= 193 && v.value <= 243) {
				return "标准"
			} else if (v.value < 193) {
				return "弱"
			}
		} else {
			if (v.value > 229) {
				return "强"
			} else if (v.value >= 169 && v.value <= 229) {
				return "标准"
			} else if (v.value < 169) {
				return "弱"
			}
		}
	} else if (v.age >= 60 && v.age <= 64) {
		if (v.sex == "男") {
			if (v.value > 230) {
				return "强"
			} else if (v.value >= 174 && v.value <= 230) {
				return "标准"
			} else if (v.value < 174) {
				return "弱"
			}
		} else {
			if (v.value > 214) {
				return "强"
			} else if (v.value >= 150 && v.value <= 214) {
				return "标准"
			} else if (v.value < 150) {
				return "弱"
			}
		}
	} else if (v.age >= 65 && v.age <= 69) {
		if (v.sex == "男") {
			if (v.value > 232) {
				return "强"
			} else if (v.value >= 172 && v.value <= 232) {
				return "标准"
			} else if (v.value < 172) {
				return "弱"
			}
		} else {
			if (v.value > 214) {
				return "强"
			} else if (v.value >= 146 && v.value <= 214) {
				return "标准"
			} else if (v.value < 146) {
				return "弱"
			}
		}
	} else if (v.age >= 70 && v.age <= 74) {
		if (v.sex == "男") {
			if (v.value > 220) {
				return "强"
			} else if (v.value >= 160 && v.value <= 220) {
				return "标准"
			} else if (v.value < 160) {
				return "弱"
			}
		} else {
			if (v.value > 202) {
				return "强"
			} else if (v.value >= 136 && v.value <= 202) {
				return "标准"
			} else if (v.value < 136) {
				return "弱"
			}
		}
	} else if (v.age >= 75 && v.age <= 79) {
		if (v.sex == "男") {
			if (v.value > 218) {
				return "强"
			} else if (v.value >= 146 && v.value <= 218) {
				return "标准"
			} else if (v.value < 146) {
				return "弱"
			}
		} else {
			if (v.value > 200) {
				return "强"
			} else if (v.value >= 136 && v.value <= 200) {
				return "标准"
			} else if (v.value < 136) {
				return "弱"
			}
		}
	} else if (v.age >= 80 && v.age <= 84) {
		if (v.sex == "男") {
			if (v.value > 206) {
				return "强"
			} else if (v.value >= 142 && v.value <= 206) {
				return "标准"
			} else if (v.value < 142) {
				return "弱"
			}
		} else {
			if (v.value > 182) {
				return "强"
			} else if (v.value >= 120 && v.value <= 182) {
				return "标准"
			} else if (v.value < 120) {
				return "弱"
			}
		}
	} else if (v.age >= 85 && v.age <= 89) {
		if (v.sex == "男") {
			if (v.value > 182) {
				return "强"
			} else if (v.value >= 118 && v.value <= 182) {
				return "标准"
			} else if (v.value < 118) {
				return "弱"
			}
		} else {
			if (v.value > 170) {
				return "强"
			} else if (v.value >= 110 && v.value <= 170) {
				return "标准"
			} else if (v.value < 110) {
				return "弱"
			}
		}
	} else if (v.age >= 90) {
		if (v.sex == "男") {
			if (v.value > 172) {
				return "强"
			} else if (v.value >= 104 && v.value <= 172) {
				return "标准"
			} else if (v.value < 104) {
				return "弱"
			}
		} else {
			if (v.value > 144) {
				return "强"
			} else if (v.value >= 88 && v.value <= 144) {
				return "标准"
			} else if (v.value < 88) {
				return "弱"
			}
		}
	}
}
//单腿站立平衡
export function OneLegStandingBalance(v) {
	if (v >= 30) {
		return "良好"
	} else if (v >= 20 && v <= 29) {
		return "中等"
	} else if (v >= 10 && v <= 19) {
		return "中等以下"
	} else if (v >= 0 && v <= 9) {
		return "差"
	}
}
