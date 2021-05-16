import httpUtil from './http'
import {upLoadFile} from '../api'

class httpRequest {
  /**
   * 根据用户学院获取课程信息
   * @param {object} param url,data,method,head
   */
  listSubjectByCollege = (param) => httpUtil({url:"/subject/listSubjectByCollege",param})

    /**
   * 获取问题列表
   */
  getQuestionList = param => httpUtil({url:"/question/search",param})

  /**
   * 收藏问题
   */
  CollectionProblem = param => httpUtil({url:"/question/followQuestion",param,method:'post',header:{"Content-Type":"application/x-www-form-urlencoded"}})

    /**
   * 取消收藏问题
   */
  cancelCollectionProblem = param => httpUtil({url:"/question/cancelFollow",param,method:'post',header:{"Content-Type":"application/x-www-form-urlencoded"}})

  /**
   * 举报问题
   */
  reportQuestion = ({filePath,data}) => {
    if(filePath)  return upLoadFile({url:'/question/reportQuestion',filePath,data})
    else return httpUtil({url:"/question/reportQuestion",param:data,method:'post',header:{"Content-Type":"application/x-www-form-urlencoded"}})
  }

  /**
   * 用户查看个人信息
   */
  getAccountById = (param) =>httpUtil({url:"/account/getAccountById",param})

  /**
   * 用户修改个人信息
   */
    editPersonal = ({filePath,data}) =>{
      if(filePath) return upLoadFile({url:'/account/updateAccount',filePath,data});
      else return httpUtil({url:"/account/updateAccount",param:data,method:'post',header:{"Content-Type":"application/x-www-form-urlencoded"}})
    }
    /**
     * 查看排行榜
     */
    getRankList = param => httpUtil({url:"/account/showRank",param})

    /**
     * 提交反馈
     */
    submitFeedback = ({filePath,data})=>{
      if(filePath) return upLoadFile({url:'/feedback/addFeedback',filePath,data});
      else return httpUtil({url:"/feedback/addFeedback",param:data,method:'post',header:{"Content-Type":"application/x-www-form-urlencoded"}})
    }

    /**
     * 获取反馈列表 
     */
    getFeedBackList = param => httpUtil({url:"/feedback/listFeedback",param})
  /**
   * 根据问题ID获取问题详情
   */
  getQustionDetailById = (param) =>httpUtil({url:"/question/getQuestionById",param})

  /**
   * 提问时获取科目信息
   */
  searchSubject = (param) =>httpUtil({url:"/subject/search",param})

  /**
   * 发布问题
   */
  submitQuestion = ({filePath,data}) =>{
    if(filePath) return upLoadFile({url:'/question/addQuestion',filePath,data});
    else return httpUtil({url:"/question/addQuestion",param:data,method:'post',header:{"Content-Type":"application/x-www-form-urlencoded"}})
  }

  /**
   * 发布回答
   */
  submitAnswer = ({filePath,data}) =>{
    if(filePath) return upLoadFile({url:'/answer/addAnswer',filePath,data});
    else return httpUtil({url:"/answer/addAnswer",param:data,method:'post',header:{"Content-Type":"application/x-www-form-urlencoded"}})
  }

  /**
   * 获取回答列表
   */
  getAnswerList = param => httpUtil({url:'/answer/listAnswer',param})

  /**
   * 赞同回答
   */
  agreeAnswer = param => httpUtil({url:'/answer/agreeAnswer',method:"post",param,header:{"Content-Type":"application/x-www-form-urlencoded"}})

  /**
   * 取消赞同回答
   */
  cancelAgreeAnswer = param => httpUtil({url:'/answer/cancelAgree',method:"post",param,header:{"Content-Type":"application/x-www-form-urlencoded"}})
}

export default new httpRequest();