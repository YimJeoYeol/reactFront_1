import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";

function BbsWrite() {

	const { auth, setAuth } = useContext(AuthContext)
	const { headers, setHeaders } = useContext(HttpHeadersContext);

	const navigate = useNavigate();

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	const changeTitle = (event) => {
		setTitle(event.target.value);
	}

	const changeContent = (event) => {
		setContent(event.target.value);
	}

	const [file, setFile] = useState(null);
	const handleChangeFile = (event) => {
	setFile(event.target.files);
	}

    /* 파일 업로드 */
	const fileUpload = async (boardId) => {
        // 파일 데이터 저장
		const fd = new FormData();
		Object.values(file).forEach((file) => fd.append("file", file));

		await axios.post(`http://localhost:8989/board/${boardId}/file/upload`, fd, {headers: headers})
		.then((resp) => {
			console.log("[file.js] fileUpload() success :D");
			console.log(resp.data);

			alert("파일 업로드 성공 :D");

		})
		.catch((err) => {
			console.log("[FileData.js] fileUpload() error :<");
			console.log(err);
		});
	}

	/* [POST /bbs]: 게시글 작성 */
	const createBbs = async() => {

		const req = {
			title: title, 
			content: content
		}

		await axios
			.post("http://localhost:8989/board/write", req, {headers: headers})
			.then((resp) => {
				console.log("[BbsWrite.js] createBbs() success :D");
				console.log(resp.data);
				const boardId = resp.data.boardId;
				console.log("boardId:", boardId);
				fileUpload(boardId);

				alert("새로운 게시글을 성공적으로 등록했습니다 :D");
				navigate(`/bbsdetail/${resp.data.boardId}`); // 새롭게 등록한 글 상세로 이동
		})
		.catch((err) => {
			console.log("[BbsWrite.js] createBbs() error :<");
			console.log(err);
		});
	}

	useEffect(() => {
		// 컴포넌트가 렌더링될 때마다 localStorage의 토큰 값으로 headers를 업데이트
		setHeaders({
			"Authorization": `Bearer ${localStorage.getItem("bbs_access_token")}`
		});
		
		// 로그인한 사용자인지 체크
		if (!auth) {
			alert("로그인 한 사용자만 게시글을 작성할 수 있습니다 !");
			navigate(-1);
		}
	}, []);


	return (
		<div>
			<table className="table">
				<tbody>
					<tr>
						<th className="table-primary">작성자</th>
						<td>
							<input type="text" className="form-control"  value={localStorage.getItem("id")} size="50px" readOnly />
						</td>
					</tr>

					<tr>
						<th className="table-primary">제목</th>
						<td>
							<input type="text" className="form-control" value={title} onChange={changeTitle} size="50px" />
						</td>
					</tr>

					<tr>
						<th className="table-primary">내용</th>
						<td>
							<textarea className="form-control" value={content} onChange={changeContent} rows="10"></textarea>
						</td>
					</tr>
					<tr>
						<th className="table-primary">파일</th>
						<td>
							<input type='file' name='file' onChange={handleChangeFile} multiple="multiple" />
						</td>
					</tr>
				</tbody>
			</table>

			<div className="my-5 d-flex justify-content-center">
				<button className="btn btn-outline-secondary" onClick={createBbs}><i className="fas fa-pen"></i> 등록하기</button>
			</div>
		</div>
	);
}

export default BbsWrite;