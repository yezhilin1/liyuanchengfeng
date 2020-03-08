// pages/register/register.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      accountnumber:'',
      password:'',
      passwordagain:'',
      nickname:'',
      success:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  handleInputAccountnumber:function (e) {
    // console.log(e);
    this.setData({
      accountnumber: e.detail.value
    })
  },
  handleInputPassword:function (e) {
    // console.log(e);
    this.setData({
      password: e.detail.value
    })
  },
  handleInputPasswordAgain:function (e) {
    // console.log(e);
    this.setData({
      passwordagain: e.detail.value
    })
  },
  handleInputNickname:function (e) {
    // console.log(e);
    this.setData({
      nickname: e.detail.value
    })
  },
  submit: function (e) {
    // var that = this
    let al = this.data.accountnumber.length;
    let pl = this.data.password.length;
    let nl = this.data.nickname.length;
    if (this.data.accountnumber == ''||this.data.password == ''||this.data.passwordagain == ''||this.data.nickname == '') {
      wx.showToast({
        title: '请完善以上信息',
        image: '../../image/错误.png',
        duration: 2000
      })
      return
    }  else if (this.data.passwordagain != this.data.password) {
      wx.showToast({
        title: '两次密码不一致',
        image: '../../image/错误.png',
        duration: 2000
      })
      return
    }else if((al<5||al>8)||(pl<5||pl>8)||(nl<3||nl>6)){
      wx.showToast({
        title: '请在规定的字符数范围内填写信息',
        image: '../../image/错误.png',
        duration: 2000
      })
      return
    } 
    else {
      const db = wx.cloud.database();
      let accountnumber = this.data.accountnumber;//账号
      let password = this.data. password;//密码
      let nickname = this.data.nickname;//昵称
      db.collection("users").where({
        accountnumber:accountnumber
      }).get({
      success:res=>{
        console.log(res.data.length)
        if(res.data.length==0){
          console.log('ok')
          db.collection("users").add({
            data: {
               accountnumber:accountnumber,
                password: password,
                nickname: nickname,
                postnumber:0,
                replynumber:0,
                praisepost:[]
            }, success: res => {
             wx.showToast({
              title: '注册成功~',
               icon: 'loading',
              duration: 2000
            })
            console.log('ok2');
            console.log(res)
            this.setData({
            success: true
          })
          console.log('ok3');
          app.globalData.mynickname = nickname;
          app.globalData. myaccountnumber = accountnumber;
          console.log(app.globalData.mynickname);
          console.log(app.globalData. myaccountnumber);
          //若无返回应设置返回
          }, fail: err => {
            console.log('ok4')
              wx.showToast({
              title: '注册失败',
              icon:'none'
              })
            }
            })
        }
  	    else{
          console.log('ok5');
          wx.showToast({
            title: '该用户名已被注册',
            icon:'none'
        })
          wx.navigateTo({
                  url: '/pages/my/my',
            })
        }
      },fail:err=>{
        console.log('ok6');
        wx.showToast({
          title: '注册失败',
          icon:'none'
          })
            
        }
      })
    }
  },
  login:function(){
    wx.navigateTo({
      url: `/pages/signin/signin`
    })
  },
  returnhome:function(){
    wx.switchTab ({
      url: `/pages/class/class`
    })
  }
})