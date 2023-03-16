export default {
  /*
   * 合并数组
   */
  Tips: function (opt, to_url) {
    if (typeof opt === "string") {
      to_url = opt
      opt = {}
    }
    let title = opt.title || "",
      icon = opt.icon || "none",
      endtime = opt.endtime || 2000,
      success = opt.success
    if (title)
      uni.showToast({
        title: title,
        icon: icon,
        duration: endtime,
        success
      })
    if (to_url != undefined) {
      if (typeof to_url === "object") {
        let tab = to_url.tab || 1,
          url = to_url.url || ""
        switch (tab) {
          case 1:
            //一定时间后跳转至 table
            setTimeout(function () {
              uni.switchTab({
                url: url
              })
            }, endtime)
            break
          case 2:
            //跳转至非table页面
            setTimeout(function () {
              uni.navigateTo({
                url: url
              })
            }, endtime)
            break
          case 3:
            //返回上页面
            setTimeout(function () {
              // #ifndef H5
              uni.navigateBack({
                delta: parseInt(url)
              })
              // #endif
              // #ifdef H5
              history.back()
              // #endif
            }, endtime)
            break
          case 4:
            //关闭当前所有页面跳转至非table页面
            setTimeout(function () {
              uni.reLaunch({
                url: url
              })
            }, endtime)
            break
          case 5:
            //关闭当前页面跳转至非table页面
            setTimeout(function () {
              uni.redirectTo({
                url: url
              })
            }, endtime)
            break
        }
      } else if (typeof to_url === "function") {
        setTimeout(function () {
          to_url && to_url()
        }, endtime)
      } else {
        //没有提示时跳转不延迟
        setTimeout(
          function () {
            uni.navigateTo({
              url: to_url
            })
          },
          title ? endtime : 0
        )
      }
    }
  },
  SplitArray(list, sp) {
    if (typeof list !== "object") return []
    if (sp === undefined) sp = []
    for (var i = 0; i < list.length; i++) {
      sp.push(list[i])
    }
    return sp
  },
  trim(str) {
    return String.prototype.trim.call(str)
  },
  $h: {
    //除法函数，用来得到精确的除法结果
    //说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
    //调用：$h.Div(arg1,arg2)
    //返回值：arg1除以arg2的精确结果
    Div: function (arg1, arg2) {
      arg1 = parseFloat(arg1)
      arg2 = parseFloat(arg2)
      var t1 = 0,
        t2 = 0,
        r1,
        r2
      try {
        t1 = arg1.toString().split(".")[1].length
      } catch (e) {}
      try {
        t2 = arg2.toString().split(".")[1].length
      } catch (e) {}
      r1 = Number(arg1.toString().replace(".", ""))
      r2 = Number(arg2.toString().replace(".", ""))
      return this.Mul(r1 / r2, Math.pow(10, t2 - t1))
    },
    //加法函数，用来得到精确的加法结果
    //说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
    //调用：$h.Add(arg1,arg2)
    //返回值：arg1加上arg2的精确结果
    Add: function (arg1, arg2) {
      arg2 = parseFloat(arg2)
      var r1, r2, m
      try {
        r1 = arg1.toString().split(".")[1].length
      } catch (e) {
        r1 = 0
      }
      try {
        r2 = arg2.toString().split(".")[1].length
      } catch (e) {
        r2 = 0
      }
      m = Math.pow(100, Math.max(r1, r2))
      return (this.Mul(arg1, m) + this.Mul(arg2, m)) / m
    },
    //减法函数，用来得到精确的减法结果
    //说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的减法结果。
    //调用：$h.Sub(arg1,arg2)
    //返回值：arg1减去arg2的精确结果
    Sub: function (arg1, arg2) {
      arg1 = parseFloat(arg1)
      arg2 = parseFloat(arg2)
      var r1, r2, m, n
      try {
        r1 = arg1.toString().split(".")[1].length
      } catch (e) {
        r1 = 0
      }
      try {
        r2 = arg2.toString().split(".")[1].length
      } catch (e) {
        r2 = 0
      }
      m = Math.pow(10, Math.max(r1, r2))
      //动态控制精度长度
      n = r1 >= r2 ? r1 : r2
      return ((this.Mul(arg1, m) - this.Mul(arg2, m)) / m).toFixed(n)
    },
    //乘法函数，用来得到精确的乘法结果
    //说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
    //调用：$h.Mul(arg1,arg2)
    //返回值：arg1乘以arg2的精确结果
    Mul: function (arg1, arg2) {
      arg1 = parseFloat(arg1)
      arg2 = parseFloat(arg2)
      var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString()
      try {
        m += s1.split(".")[1].length
      } catch (e) {}
      try {
        m += s2.split(".")[1].length
      } catch (e) {}
      return (
        (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) /
        Math.pow(10, m)
      )
    }
  }
}
