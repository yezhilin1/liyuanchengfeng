// pages/post/post.js
var util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classarray: ['校园安全', '校园卫生', '校园饮食', '宿舍管理', '学生事务', '失物招领'],
    index:'0',
    titleN:'',
    contentresult:'',
    imagesList:[],
    fP:''
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
    this.init();
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
  init(){
    wx.showToast({
      title: '文明用语，合理诉求',
      icon: 'none',
      
      duration: 2000
    })
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  titleNameInput: function (e) {
    this.setData({
      titleN: e.detail.value
    })
  },
  getDataBindTap: function (e) {
    this.setData({
      contentresult: e.detail.value
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
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 500
        })
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
          // var timestamp = Date.parse(new Date());
          // const cloudPath = timestamp + filePath.match(/\.[^.]+?$/)[0];
          // wx.cloud.uploadFile({
          //   cloudPath,
          //   filePath,
          //   success: res => {
          //     console.log('[上传图片] 成功：', res)
          //     that.setData({
          //       imagesList: that.data.imgList.concat(res.fileID)
          //     })
          //     that.is_all_ok()
          //   },
          //   fail: e => {
          //     console.error('[上传图片] 失败：', e)
          //     wx.showToast({
          //       icon: 'none',
          //       title: '上传失败',
          //     })
          //   },
          //   complete: () => {
          //     wx.hideLoading()
          //   }
          // })
      },
      fail: e => {
        console.error(e)
      }
    })
  },
  post: function () {
    const db = wx.cloud.database();
    let imagelist = [];
    let filePath = this.data.fP;
    let timestamp = Date.parse(new Date());
    const cloudPath = timestamp + filePath.match(/\.[^.]+?$/)[0];
    let nickname = app.globalData.mynickname;
    let accountnumber = app.globalData.myaccountnumber;
    let postnumber = app.globalData.mypostnumber;
    let index = this.data.index;
    let title = this.data.titleN;
    let content = this.data.contentresult;
    let time = util.formatTime(new Date());
    if(filePath!==''){
      wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success: res => {
            
            imagelist = imagelist.concat(res.fileID);
            
          // this.is_all_ok()
          
          if(title!==''&&content!==''){
            
            if(nickname!==''){
              
                db.collection("posts").add({
                  data: {
                    classid:index,
                    nickname:nickname,
                    title: title,
                    content: content,
                    imagelist: imagelist,
                    time:time,
                    praisenumber:0,
                    commentnumber:0,
                    
                    notPraise:true
                  }, success: res => {
                    
                    wx.showToast({
                      title: '发帖成功',
                    }) 
                    postnumber++;
                    db.collection('users').where({
                      accountnumber:accountnumber
                    }).update({
                      data:{
                        postnumber:postnumber
                      },success: res => {
                        wx.showToast({
                          title: '发帖数+1',
                        })
                        app.globalData.mypostnumber = postnumber;
                        wx.reLaunch({
                          url: `/pages/class/class`,
                          
                        })
                      }, fail: err => {
                        wx.showToast({
                          title: '修改失败',
                          icon:'none'
                        }) 
                      }
                
                    })
                    wx.navigateTo({
                      url: '/pages/class/class',
                    })
                  }, fail: err => {
                    wx.showToast({
                      title: '发帖失败',
                      icon:'none'
                      
                      
                    })
                  }
                })
             }
             else{
               
              wx.showToast({
                title: '尚未登录，请先登录再发帖',
                icon:'none'
              })
        
             }
            }
          else {
          wx.showToast({
                      title: '标题与正文不能为空',
                      icon:'none'
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
      if(title!==''&&content!==''){
        if(nickname!==''){
            db.collection("posts").add({
              data: {
                classid:index,
                nickname:nickname,
                title: title,
                content: content,
                imagelist: imagelist,
                time:time,
                praisenumber:0,
                commentnumber:0,
                
                notPraise:true
              }, success: res => {
                
                wx.showToast({
                  title: '发帖成功',
                }) 
                postnumber++;
                db.collection('users').where({
                  accountnumber:accountnumber
                }).update({
                  data:{
                    postnumber:postnumber
                  },success: res => {
                    wx.showToast({
                      title: '发帖数+1',
                    })
                    app.globalData.mypostnumber = postnumber;
                    wx.navigateTo({
                      url: `/pages/class/class`,
                      
                    })
                  }, fail: err => {
                    wx.showToast({
                      title: '修改失败',
                      icon:'none'
                    })
                  }
            
                })
                wx.navigateTo({
                  url: '/pages/class/class',
                })
              }, fail: err => {
                wx.showToast({
                  title: '发帖失败',
                  icon:'none'
                  
                  
                })
              }
            })
         }
         else{
           
          wx.showToast({
            title: '尚未登录，请先登录再发帖',
            icon:'none'
          })
    
         }
        }
      else {
      wx.showToast({
                  title: '标题与正文不能为空',
                  icon:'none'
                })
      }
    }
    
  
    },
    cancel:function(){
      console.log(this.data.imagesList)
      // this.setData({
      //   titleN:'',
      //   contentresult:'',
      //   imagesList:[]
      // })

    }
})