// pages/content/content.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    flag:false,
    postid:'',
    postobjs:[
      
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initcontent(options.id);
   
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
  
  initcontent(id){
    let praisepost = app.globalData.mypraisepost;
    const db = wx.cloud.database();
    let that = this;
    let temp =[];
    that.setData({
      postid:id
    })
    db.collection("posts").where({
      _id:id
    }).get({
      success:res=>{
        if(res.data.length!==0){
          let len = res.data.length;
          for(let a=0; a< len;a++){
            if(praisepost.indexOf(res.data[a]._id)==-1)
              res.data[a].notPraise=true;
            else
              res.data[a].notPraise=false;
          }
          for(let b=0;b<len;b++){
            let m = res.data[b].imagelist;
            let n = m.length;
            
            for(let c=0;c<n;c++){
              console.log(m[c])
              wx.cloud.downloadFile({
                fileID: m[c], // 文件 ID
                success: re => {
                  // 返回临时文件路径
                  
                  res.data[b].imagelist[c]=re.tempFilePath;
                  
                },
                fail: console.error
              })
              
              
              
            }
          }
          temp = res.data;
          
          db.collection("replys").where({
            postid:id
          }).get({
            success:res=>{
              
              if(res.data.length!==0){
                let len = res.data.length;
                for(let a=0; a< len;a++){
                  if(praisepost.indexOf(res.data[a]._id)==-1)
                    res.data[a].notPraise=true;
                  else
                    res.data[a].notPraise=false;
                }
                for(let b=0;b<len;b++){
                  let m = res.data[b].imagelist;
                  let n = m.length;
                  
                  for(let c=0;c<n;c++){
                    console.log(m[c])
                    wx.cloud.downloadFile({
                      fileID: m[c], // 文件 ID
                      success: re => {
                        // 返回临时文件路径
                        
                        res.data[b].imagelist[c]=re.tempFilePath;
                        
                      },
                      fail: console.error
                    })
                  
                  }
                }
                let s= temp.concat(res.data);
                
                
                
                that.setData({
                  postobjs:s,
                  title:s[0].title
                })
              }
              else{
                that.setData({
                  postobjs:temp,
                  title:temp[0].title
                })
                wx.showToast({
                  icon:"none",
                  title: '暂无相关评论',
                })
              }      
            },fail:err=>{
              console.log(err);
            }
          })
          
          
        }
        else{
          wx.showToast({
            icon:"none",
            title: '贴子查询失败',
          })
        }
      },fail:err=>{
        console.log(err);
      }
    })
    
    
    
  },
 
  praise(e){
    const db = wx.cloud.database();
    let n = e.currentTarget.dataset.id;
    let  num = e.currentTarget.dataset.num;
    let index = e.currentTarget.dataset.index;
    let newnum = num + 1;
    let praisepost = app.globalData.mypraisepost;
    let userid = app.globalData.myaccountnumber;
    console.log(userid);
    let temp1 ='postobjs['+index+'].notPraise';
    let temp2 ='postobjs['+index+'].praisenumber';
    praisepost.push(n);
    if(userid!==''){
      db.collection("posts").doc(n).update({
        data: {
          praisenumber:newnum,
        }, success: res => {
          if(res.stats.updated!==0){
            this.setData({
              [temp1]:false,
              [temp2]:newnum
            })
            console.log(this.data.postobjs);
            app.globalData.mypraisepost = praisepost;
            db.collection("users").where({
                accountnumber:userid
            }).update({
              data: {
                praisepost:praisepost,
              }, success :res => {
                
                if(res.stats.updated!==0)
                  wx.showToast({
                    title: '点赞成功',
                  })
                else
                wx.showToast({
                  title: '点赞失败',
                  icon:'none'
                })
              },fail:err=>{
                console.log(err);
              }
            })
          }
          else{
            db.collection("replys").doc(n).update({
              data: {
                praisenumber:newnum,
              }, success: res => {
                if(res.stats.updated!==0){
                  this.setData({
                    [temp1]:false,
                    [temp2]:newnum
                  })
                  app.globalData.mypraisepost = praisepost;
                  db.collection("users").where({
                    accountnumber:userid
                }).update({
                    data: {
                      praisepost:praisepost,
                    }, success :res => {
                      if(res.stats.updated!==0)
                        wx.showToast({
                          title: '点赞成功',
                        })
                      else
                      wx.showToast({
                        title: '点赞失败',
                        icon:'none'
                      })
                    },fail:err=>{
                      console.log(err);
                    }
                  })
                  }
                else
                wx.showToast({
                  title: '点赞失败',
                  icon:'none'
                })
              }, fail: err => {
                console.log(err);
                
              }
            })
            
          }
          
        }, fail: err => {
          console.log(err);
        }
      })
    }
    else
      wx.showToast({
        title: '请先登录再点赞',
        icon:'none'
      })
    
  },
  notpraise(e){

    const db = wx.cloud.database();
    let n = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let newnum = e.currentTarget.dataset.num - 1;
    let praisepost = app.globalData.mypraisepost;
    let userid = app.globalData.myaccountnumber;
    let temp1='postobjs['+index+'].notPraise';
    let temp2='postobjs['+index+'].praisenumber';
    for(let b in praisepost)
      if(praisepost[b]==n)
        praisepost.splice(b,1)
    console.log(praisepost)
    
    if(userid!==''){
      db.collection("posts").doc(n).update({
        data: {
          praisenumber:newnum,
        }, success: res => {
          if(res.stats.updated!==0){
            this.setData({
              [temp1]:true,
              [temp2]:newnum
            })
            app.globalData.mypraisepost = praisepost;
            db.collection("users").where({
              accountnumber:userid
          }).update({
              data: {
                praisepost:praisepost,
              }, success :res => {
                if(res.stats.updated!==0)
                  wx.showToast({
                    title: '取消点赞成功',
                  })
                else
                wx.showToast({
                  title: '取消点赞失败',
                  icon:'none'
                })
              },fail:err=>{
                console.log(err);
              }
            })
          }
          else{
            db.collection("replys").doc(n).update({
              data: {
                praisenumber:newnum,
              }, success: res => {
                if(res.stats.updated!==0){
                  this.setData({
                    [temp1]:true,
                    [temp2]:newnum
                  })
                  app.globalData.mypraisepost = praisepost;
                  db.collection("users").where({
                    accountnumber:userid
                }).update({
                    data: {
                      praisepost:praisepost,
                    }, success :res => {
                      if(res.stats.updated!==0)
                        wx.showToast({
                          title: '取消点赞成功',
                        })
                      else
                      wx.showToast({
                        title: '取消点赞失败',
                        icon:'none'
                      })
                    },fail:err=>{
                      console.log(err);
                    }
                  })
                  }
                else
                wx.showToast({
                  title: '取消点赞失败',
                  icon:'none'
                })
              }, fail: err => {
                console.log(err);
                
              }
            })
            
          }
          
        }, fail: err => {
          console.log(err);
        }
      })
    }
    else
      wx.showToast({
        title: '请先登录再点赞',
        icon:'none'
      })

    
  },
  back(){
    // console.log(this.data.postobjs)
    wx.navigateBack({
      delta:1
    })
  },
  reply(){
    let postid = this.data.postid;
    if(app.globalData. myaccountnumber!=='')
    // if(true)
      wx.navigateTo({
        url: `/pages/replyinput/replyinput?id=${postid}`
      })
    else
      wx.showToast({
        title: '请先登录再评论',
        icon:'none'
      })
  },
  er(e){
    console.log(e)
  }
})