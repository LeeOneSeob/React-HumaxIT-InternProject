import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { env } from '../data/config';

const downloadFileLink = (file, fileName) => {
  // 서버로부터 받은 binary data를 별도의 URL 생성 하고 속성을 다운로드로 변경, 강제 클릭이벤트를 발생시켜 파일다운로드
  const url = window.URL.createObjectURL(new Blob([file]));
  const link = document.createElement('a');

  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
};

const pTagStyle = {
  textIndent: '10px',
};
const buttonStyle = {
  margin: '3px',
};
class SubmitAssignDetail extends Component {
  downloadFile = async (fileKey, originalFileName, e) => {
    try {
      e.preventDefault();
      const res = await axios({
        url: `${
          env.ServerURL
        }/api/classroom/submitAssign/download/${fileKey}/${originalFileName}`,
        params: {
          file: fileKey,
          originalFileName,
        },
        headers: {
          token: localStorage.getItem('token'),
        },
        // important!! 파일을 다운로드 받기 위해
        responseType: 'blob', 
      });

      if (res.data === 0) {
        window.alert('토큰이 만료되었습니다. 재로그인 해주세요.');
        window.location.href = '/app/login';
      }

      downloadFileLink(res.data, originalFileName);

      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { submitAssign } = this.props;

    // eslint-disable-next-line prefer-destructuring

    return (
      <div style={{ margin: '20px' }}>
        <div>
          <b>제출과제 내용</b>
          <p style={pTagStyle}>{submitAssign.submitAsignDescription}</p>
          {submitAssign.originalFileName ? (
            <div>
              <b>첨부 파일 :</b>

              <a
                style={{ fontSize: '15px' }}
                href="none"
                onClick={e =>
                  this.downloadFile(
                    submitAssign.serverFileName,
                    submitAssign.originalFileName,
                    e,
                  )
                }
              >
                {' '}
                {`${submitAssign.originalFileName} (${
                  submitAssign.fileSize
                } byte)`}
              </a>
            </div>
          ) : null}
        </div>
        <div style={{ textAlign: 'right' }}>
          <Button
            style={buttonStyle}
            color="primary"
            variant="contained"
            onClick={this.props.closePopup}
          >
            {'닫기'}
          </Button>
        </div>
      </div>
    );
  }
}

export default SubmitAssignDetail;
