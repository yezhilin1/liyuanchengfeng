// pages/signin/signin.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      accountnumber:'',
      password:''
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
  accountnumberInput:function(e){
    this.setData({ 
      accountnumber:e.detail.value 
     })
  },
  passwordInput:function(e){
    this.setData({ 
      password:e.detail.value 
     })
  },
  login:function(){
    
    if(this.data.accountnumber.length == 0 || this.data.password.length == 0){ 
        wx.showToast({ 
            title: '账号和密码不能为空', 
            icon: 'none', 
            duration: 3000 
        }) 
}else { 
  //发送请求进行验证
 // 这里修改成跳转的页面 
    const db = wx.cloud.database();
    let accountnumber = this.data.accountnumber;
    let password = this.data.password; 
    db.collection("users").where({
      accountnumber:accountnumber
    }).get({
       success:res=>{
         if(res.data.length!==0){
          if(password==res.data[0].password){
            app.globalData.mynickname = res.data[0].nickname;
            app.globalData. myaccountnumber = res.data[0]. accountnumber;
            app.globalData.mypostnumber = res.data[0].postnumber;
            app.globalData.myreplynumber = res.data[0].replynumber;
            app.globalData.mypraisepost = res.data[0].praisepost;
            //修改本机登录状态标记以及本机昵称
             wx.showToast({ 
              title: '登录成功', 
              icon: 'success', 
              duration:2000
                 }) 
                 wx.switchTab({
                  url: `/pages/my/my`
                })
   }        
            else{
              console.log('输入密码不符');
            }
         }
         else{
          wx.showToast({ 
            title: '找不到该账户', 
            icon: 'none', 
            duration: 2000 
               })
         }
       },fail:err=>{
           console.log(err);
            
         }
       })
        } 
      },
  register:function(){
    wx.navigateTo({
      url: `/pages/register/register`
    })
  }
})