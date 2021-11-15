import httpUtil from './http'
import { upLoadFile } from '../api'

class httpRequest {
  /**
   * 登录
   */
  login = (param) =>httpUtil({url:"/casLogin",param})
  /** 
   * 获取绑定的用户信息
  */
  getBindUserInfo = (param) =>httpUtil({url:"/account/getAccountByUniqueId",param})
  /**
   * 根据用户学院获取课程信息
   * @param {object} param url,data,method,head
   */
  listSubjectByCollege = (param) => httpUtil({ url: "/subject/listSubjectByCollege", param })

  /**
   * 查询得到课程详细信息
   */
  getCouseList = (param) => httpUtil({ url: '/subject/search', param })
  /**
   * 获取所有学院
   */
  getAllCollege = (param) => httpUtil({url:'/subject/listAllCollege'})
  /** 
   * 获取图片
   */
  getImgs = param => httpUtil({ url: '/resource/listImgByType', param })

  /**
   * 获取未读消息数量
   */
  getUnReadMsg = (param) => httpUtil({ url: "/email/getUnreadCount", param })

  /**
   * 获取问题列表
   */
  getQuestionList = param => httpUtil({ url: "/question/search", param })

  /**
   * 收藏问题
   */
  CollectionProblem = param => httpUtil({ url: "/question/followQuestion", param, method: 'post', header: { "Content-Type": "application/x-www-form-urlencoded" } })

  /**
   * 取消收藏问题
   */
  cancelCollectionProblem = param => httpUtil({ url: "/question/cancelFollow", param, method: 'post', header: { "Content-Type": "application/x-www-form-urlencoded" } })

  /**
   * 举报问题
   */
  reportQuestion = ({ filePath, data }) => {
    if (filePath) return upLoadFile({ url: '/question/reportQuestion', filePath, data })
    else return httpUtil({ url: "/question/reportQuestion", param: data, method: 'post', header: { "Content-Type": "application/x-www-form-urlencoded" } })
  }

  /**
  * 举报回答
   */
  reportAnswer = ({ filePath, data }) => {
    if (filePath) return upLoadFile({ url: '/answer/reportAnswer', filePath, data })
    else return httpUtil({ url: "/answer/reportAnswer", param: data, method: 'post', header: { "Content-Type": "application/x-www-form-urlencoded" } })
  }

  /**
   * 举报评论
   */
  reportComment = ({ filePath, data }) => {
    if (filePath) return upLoadFile({ url: '/comment/reportComment', filePath, data })
    else return httpUtil({ url: "/comment/reportComment", param: data, method: 'post', header: { "Content-Type": "application/x-www-form-urlencoded" } })
  }

  /**
   * 用户查看个人信息
   */
  getAccountById = (param) => httpUtil({ url: "/account/getAccountById", param })

  /**
   * 用户修改个人信息
   */
  editPersonal = ({ filePath, data }) => {
    if (filePath) return upLoadFile({ url: '/account/updateAccount', filePath, data });
    else return httpUtil({ url: "/account/updateAccount", param: data, method: 'post', header: { "Content-Type": "application/x-www-form-urlencoded" } })
  }
  
  /**
   * 查看排行榜
   */
  getRankList = param => httpUtil({ url: "/account/showRank", param })

  /**
   * 提交反馈
   */
  submitFeedback = ({ filePath, data }) => {
    if (filePath) return upLoadFile({ url: '/feedback/addFeedback', filePath, data });
    else return httpUtil({ url: "/feedback/addFeedback", param: data, method: 'post', header: { "Content-Type": "application/x-www-form-urlencoded" } })
  }

  /**
   * 获取反馈列表 
   */
  getFeedbackList = param => httpUtil({ url: "/feedback/listFeedback", param })

  /**
   * 点赞反馈
   */
  agreeFeedback = param => httpUtil({ url: "/feedback/agreeFeedback", param, method: 'post', header: { "Content-Type": "application/x-www-form-urlencoded" } })
  /**
   * 取消点赞反馈
   */
  cancelAgreeFeedback = param => httpUtil({ url: "/feedback/cancelAgree", param, method: 'post', header: { "Content-Type": "application/x-www-form-urlencoded" } })
  /**
   * 根据问题ID获取问题详情
   */
  getQustionDetailById = (param) => httpUtil({ url: "/question/getQuestionById", param })

  /**
   * 提问时获取科目信息
   */
  searchSubject = (param) => httpUtil({ url: "/subject/search", param })

  /**
   * 发布问题
   */
  submitQuestion = ({ filePath, data }) => {
    if (filePath) return upLoadFile({ url: '/question/addQuestion', filePath, data });
    else return httpUtil({ url: "/question/addQuestion", param: data, method: 'post', header: { "Content-Type": "application/x-www-form-urlencoded" } })
  }

  /**
   * 发布回答
   */
  submitAnswer = ({ filePath, data }) => {
    if (filePath) return upLoadFile({ url: '/answer/addAnswer', filePath, data });
    else return httpUtil({ url: "/answer/addAnswer", param: data, method: 'post', header: { "Content-Type": "application/x-www-form-urlencoded" } })
  }

  /**
   * 获取回答列表
   */
  getAnswerList = param => httpUtil({ url: '/answer/listAnswer', param })

  /**
   * 获取回答详情 
   */
  getAnswerDetail = param => httpUtil({url:'/answer/getAnswerById',param})
  /**
   * 采纳回答
   */
  acceptAnswer = param => httpUtil({ url: "/question/accept", param, method: 'post', header: { "Content-Type": "application/x-www-form-urlencoded" } })

  /**
   * 赞同回答
   */
  agreeAnswer = param => httpUtil({ url: '/answer/agreeAnswer', method: "post", param, header: { "Content-Type": "application/x-www-form-urlencoded" } })

  /**
   * 取消赞同回答
   */
  cancelAgreeAnswer = param => httpUtil({ url: '/answer/cancelAgree', method: "post", param, header: { "Content-Type": "application/x-www-form-urlencoded" } })

  /**
   * 发表评论
   */
  submitComment = param => httpUtil({ url: '/comment/addComment', method: "post", param, header: { "Content-Type": "application/x-www-form-urlencoded" } })

  /**
   * 获取评论
   */
  getComment = param => httpUtil({ url: '/comment/listComment', param })

  /**
   * 获得资讯列表
   */
  getNews = param => httpUtil({ url: '/news/listNews', param })

  /**
   * 获取咨询详情
   */
  getNewDetail = param => httpUtil({ url: '/news/getNewsById', param })

  /**
   * 获取动态
   */
  getDynamic = param => httpUtil({ url: '/email/showDynamic', param })

  /**
   * 查看被邀请
   */
  getInvitation = param => httpUtil({ url: '/email/showMyInvitation', param })

  /**
   * 查看个人收藏
   */
  getAboutMyQuestion = param => httpUtil({ url: '/question/relatedQuestion', param })

  /**
   * 修改问题
   */
  updateQuestion =({ filePath, data }) => {
    if (filePath) return upLoadFile({ url: '/question/updateQuestion', filePath, data });
    else return httpUtil({ url: "/question/updateQuestion", param: data, method: 'post', header: { "Content-Type": "application/x-www-form-urlencoded" } })
  }
}

export default new httpRequest();