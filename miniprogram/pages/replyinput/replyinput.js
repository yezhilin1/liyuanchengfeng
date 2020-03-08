// pages/replyinput/replyinput.js
var util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentresult:'',
    postid:'',
    imagesList:[],
    fP:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.inintid(options.id);
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
  getDataBindTap: function (e) {
    this.setData({
      contentresult: e.detail.value
    })
  },
  inintid(id){
    this.setData({
      postid:id
    })
  },
  uploader: function () {

    var that = this;
    let imagesList = [];
    let maxSize = 1024 * 1024;
    let maxLength = 3;
    let flag = true;
    wx.chooseImage({
      count: 6, //最多可以选择的图片总数
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // wx.showToast({
        //   title: '正在上传...',
        //   icon: 'loading',
        //   mask: true,
        //   duration: 500
        // })
        for (let i = 0; i < res.tempFiles.length; i++) {
          if (res.tempFiles[i].size > maxSize) {
            flag = false;
            console.log(111)
            wx.showModal({
              content: '图片太大，不允许上传',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              }
            });
          }
        }

        if (res.tempFiles.length > maxLength) {
          console.log('222');
          wx.showModal({
            content: '最多能上传' + maxLength + '张图片',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('确定');
              }
            }
          })
        }

        if (flag == true && res.tempFiles.length <= maxLength) {
          that.setData({
            imagesList: res.tempFilePaths
          })
        }

        const filePath = res.tempFilePaths[0]
        that.setData({
          fP:filePath
        })
          // 上传图片<br>　　　　　　
          // 定义图片名，为了避免重复我是用的是上传图片的时间戳
    //       var timestamp = Date.parse(new Date());
    //       const cloudPath = timestamp + filePath.match(/\.[^.]+?$/)[0]
    //       wx.cloud.uploadFile({
    //         cloudPath,
    //         filePath,
    //         success: res => {
    //           console.log('[上传图片] 成功：', res)
    //           that.setData({
    //             imagesList: that.data.imgList.concat(res.fileID)
    //           })
    //           that.is_all_ok()
    //         },
    //         fail: e => {
    //           console.error('[上传图片] 失败：', e)
    //           wx.showToast({
    //             icon: 'none',
    //             title: '上传失败',
    //           })
    //         },
    //         complete: () => {
    //           wx.hideLoading()
    //         }
    //       })
      },
      fail: e => {
        console.error(e)
      }
    })
  },
  post(id){
    const db = wx.cloud.database();
    let imagelist = [];
    let filePath = this.data.fP;
    let nickname = app.globalData.mynickname;
    let accountnumber = app.globalData.myaccountnumber;
    let replynumber = app.globalData.myreplynumber;
    let postid = this.data.postid;
    let content = this.data.contentresult;
    let time = util.formatTime(new Date());
    let commentN;
    if(filePath!==''){
      let timestamp = Date.parse(new Date());
      const cloudPath = timestamp + filePath.match(/\.[^.]+?$/)[0];
      wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success: res => {
            imagelist = imagelist.concat(res.fileID)
            if(content!==''){
              db.collection("replys").add({
                data: {
                  postid,
                  nickname,
                  content,
                  imagelist,
                  time,
                  praisenumber:0,
                  notPraise:true
                }, success: res => {
                  db.collection("posts").doc(postid).get({
                    success: res => {
                      commentN = res.data.commentnumber;
                      commentN++;
                      db.collection("posts").doc(postid).update({
                        data: {
                          commentnumber: commentN,
                        }, success: res => {
                          db.collection('users').where({
                            accountnumber:accountnumber
                          }).update({
                            data:{
                              replynumber:replynumber+1
                            },success:res=>{
                              wx.showToast({
                                title: '评论成功',
                              })
                              app.globalData.myreplynumber = replynumber+1;
            
                              // wx.navigateTo({ 
                              //   url: `/pages/content/content?id=${postid}`
                              // })
                              wx.navigateBack({
                                delta:1
                              })
                            },fail:err=>{
                              console.update(err)
                            }
                          })
                          
                        }, fail: err => {
                          
                          wx.showToast({
                            title: '数据库更新失败',
                            icon:'none'
                          })
                          console.log(err);
                        }
                      })
                      
                    }, fail: err => {
                      
                      console.log(err);
                      wx.showToast({
                        title: '数据库获取失败',
                        icon:'none'
                      })
                    }
                  })
                }, fail: err => {
                  wx.showToast({
                    title: '评论失败',
                  }) 
                }
              })
           }
            else {
                wx.showToast({
                    title: '评论内容不能空白',
                  })
        }
          
        },
        fail: err => {
          console.log(err)
        },
        complete: () => {
          wx.hideLoading()
        }
      })
    }
    else{
      if(content!==''){
        db.collection("replys").add({
          data: {
            postid,
            nickname,
            content,
            imagelist,
            time,
            praisenumber:0,
            notPraise:true
          }, success: res => {
            db.collection("posts").doc(postid).get({
              success: res => {
                commentN = res.data.commentnumber;
                commentN++;
                db.collection("posts").doc(postid).update({
                  data: {
                    commentnumber: commentN,
                  }, success: res => {
                    db.collection('users').where({
                      accountnumber:accountnumber
                    }).update({
                      data:{
                        replynumber:replynumber+1
                      },success:res=>{
                        wx.showToast({
                          title: '评论成功',
                        })
                        app.globalData.myreplynumber = replynumber+1;
      
                        wx.navigateTo({ 
                          url: `/pages/content/content?id=${postid}`
                        })
                        // wx.navigateBack({
                        //   delta:1
                        // })
                      },fail:err=>{
                        console.update(err)
                      }
                    })
                    
                  }, fail: err => {
                    
                    wx.showToast({
                      title: '数据库更新失败',
                      icon:'none'
                    })
                    console.log(err);
                  }
                })
                
              }, fail: err => {
                
                console.log(err);
                wx.showToast({
                  title: '数据库获取失败',
                  icon:'none'
                })
              }
            })
          }, fail: err => {
            wx.showToast({
              title: '评论失败',
            }) 
          }
        })
     }
      else {
          wx.showToast({
              title: '评论内容不能空白',
            })
          }
    }
    
   
  },
  back(){
    wx.navigateBack({
      delta:1
    })
    // wx.navigateTo({
    //   url: `/pages/content/content?id=${postid}`
    // })
  }
})