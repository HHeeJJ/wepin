import React, { useState, useRef, useEffect } from "react";
import styles from "./Comment.module.scss";
import CommentItem from "./CommentItem";
import { TextareaAutosize } from "@mui/material";
import axioswrapper from "../../utils/Axios";
import { localStorageUtil } from "../../utils/LocalStorage";
import { useDispatch, useSelector } from "react-redux";
import {
  setReplyList,
  setTobeDeletedReplyItem,
  addReply,
} from "../../_store/reply.slice";
import getUserAgent from "../../utils/UserAgent";

function Comment(props) {
  const { visibleCommentInput, replyList, feedId, isMine } = props;

  const [commentValue, setCommentValue] = useState();
  const [visibleApplyBtn, setVisibleApplyBtn] = useState(false);

  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const rdxReplyList = useSelector((state) => state.reply.replyList);

  useEffect(() => {
    if (visibleCommentInput) {
      inputRef.current.focus();
    }
  }, [visibleCommentInput]);

  useEffect(() => {
    if (replyList.length !== 0) {
      makeUpCommentList();
    } else {
      dispatch(setReplyList([]));
    }
  }, [replyList]);

  const handleWriteComment = (event) => {
    const inputValue = event.target.value;
    setCommentValue(inputValue);

    if (inputValue.length > 0) {
      setVisibleApplyBtn(true);
    } else {
      setVisibleApplyBtn(false);
    }
  };

  const makeUpCommentList = () => {
    const tempList = [];

    replyList.forEach((data, idx) => {
      const newItem = {
        id: idx,
        avatarSrc: data.profile,
        name: data.nickNm,
        comment: data.desc,
        replyId: data.id,
        memberId: data.memberId,
        createdAt: data.createdAt,
      };

      tempList.push(newItem);
    });

    dispatch(setReplyList(tempList));
  };

  const commentUpload = () => {
    if (commentValue.trim() === "") {
      return;
    }

    const payload = {
      desc: commentValue,
      feedId: feedId,
      memberId: localStorageUtil.get("memberId"),
      uiSeq: replyList.length + 1,
    };

    axioswrapper
      .Axios("POST", "reply/create", payload)
      .then((response) => {
        const newCommentItem = {
          id: replyList.length,
          avatarSrc: response.data.data.profile,
          name: response.data.data.nickNm,
          comment: response.data.data.desc,
          replyId: response.data.data.id,
          memberId: response.data.data.memberId,
          createdAt: response.data.data.createdAt,
        };

        dispatch(addReply(newCommentItem));
        setCommentValue("");
      })
      .catch((error) => {
        console.log("reply/create error", error);
      });
  };

  const commentDeleteClick = (item) => {
    // 삭제하기 클릭시 팝업 메뉴 생성
    dispatch(setTobeDeletedReplyItem(item));

    const ua = getUserAgent();
    if (ua === "web") {
      if (window.confirm("정말로 삭제하시겠습니까?")) {
        // 삭제 로직 처리
        const payload = {
          replyId: item.replyId,
        };

        axioswrapper
          .Axios("POST", "reply/delete", payload)
          .then((response) => {
            const newCommentList = rdxReplyList.filter(
              (listItem) => listItem !== item
            );
            dispatch(setReplyList(newCommentList));
          })
          .catch((error) => {
            console.log("reply/delete error", error);
          });
      } else {
        console.log("삭제 취소됨");
      }
    } else {
      window.ReactNativeWebView?.postMessage(
        JSON.stringify({ type: "isRealDeleteComment" })
      );
    }
  };

  return (
    <div className={styles.commentWrap}>
      <div className={styles.commentListWrap}>
        {rdxReplyList.map((listItem, idx) => {
          return (
            <CommentItem
              key={idx}
              commentDeleteClick={commentDeleteClick}
              listItem={listItem}
              isVisibleDeleteText={
                listItem.memberId === localStorageUtil.get("memberId") || isMine
              }
            />
          );
        })}
      </div>

      {visibleCommentInput && (
        <div className={styles.WriteCommentWrap}>
          <TextareaAutosize
            minRows={1}
            maxRows={4}
            placeholder="댓글 작성..."
            value={commentValue}
            onChange={handleWriteComment}
            ref={inputRef}
          />

          {visibleApplyBtn && (
            <button
              type="button"
              className={styles.btnCommentApply}
              onClick={commentUpload}
            >
              게시
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Comment;
