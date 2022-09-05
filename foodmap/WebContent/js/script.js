/***********************************************************
1. 지도 생성 & 확대 축소 컨트롤러
https://apis.map.kakao.com/web/sample/addMapControl/

*/

var container = document.getElementById("map"); //지도를 담을 영역의 DOM 레퍼런스
var options = {
	//지도를 생성할 때 필요한 기본 옵션
	center: new kakao.maps.LatLng(36.327400, 127.407275), //지도의 중심좌표. 서울 한가운데
	level: 4, //지도의 레벨(확대, 축소 정도) 3에서 8레벨로 확대
};

var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
var zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);


/********************************************************** */


// 2. 더미데이터 준비하기 (제목, 주소, url, 카테고리)
const dataSet = [
	{
		title: "오늘의 식탁",
		address: "대전 중구 오류로74번길 40",
		url: "https://www.youtube.com/watch?v=9n8oWPM6-D0",
		category: "일식",
	},
	{
		title: "초월짬뽕",
		address: "대전 중구 동서대로1304번길 30 초월짬뽕",
		url: "https://www.youtube.com/watch?v=odtpeLderqM",
		category: "중식",
	},
	{
		title: "뽀뽀분식",
		address: "대전 중구 계룡로881번길 44",
		url: "https://www.youtube.com/watch?v=33WjHMX3STI",
		category: "분식",

	},
	{
		title: "복조리닭집",
		address: "충남 보령시 정화로길 21-2",
		url: "https://www.youtube.com/watch?v=vVLxvAt3wGo",
		category: "한식",

	},
	{
		title: "피자파티",
		address: "충남 보령시 대흥로 44",
		url: "https://www.youtube.com/watch?v=fhfEKWHH5_c",
		category: "일식",

	},
	{
		title: "황해원",
		address: "충남 보령시 성주면 심원계곡로 6",
		url: "https://www.youtube.com/watch?v=FkmcPxfMOVk",
		category: "중식",

	},
	{
		title: "남포집",
		address: "충남 보령시 성주면 성주중앙길 69-4",
		url: "https://www.youtube.com/watch?v=PXgnVRuKAhs",
		category: "한식",

	},
];

/*
**********************************************************
3. 여러개 마커 찍기
  * 주소 - 좌표 변환
https://apis.map.kakao.com/web/sample/multipleMarkerImage/ (여러개 마커)
https://apis.map.kakao.com/web/sample/addr2coord/ (주소로 장소 표시하기)
*/

// 주소-좌표 변환 객체를 생성합니다
var geocoder = new kakao.maps.services.Geocoder();

// 주소-좌표 변환 함수
function getCoordsByAddress(address) {
	return new Promise((resolve, reject) => {
		// 주소로 좌표를 검색합니다
		geocoder.addressSearch(address, function(result, status) {
			// 정상적으로 검색이 완료됐으면
			if (status === kakao.maps.services.Status.OK) {
				var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
				resolve(coords);
				return;
			}
			reject(new Error("getCoordsByAddress Error: not Vaild Address"));
		});
	});
}


async function setMap(dataSet) {
	for (var i = 0; i < dataSet.length; i++) {
		let position = await getCoordsByAddress(dataSet[i].address);
		console.log(position);

		// 마커를 생성합니다
		var marker = new kakao.maps.Marker({
			map: map, // 마커를 표시할 지도
			// position: positions[i].latlng, // 마커를 표시할 위치
			position: position,
			// title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
		});
	}
}

setMap();


/* 
******************************************************************************
4. 마커에 인포윈도우 붙이기
  * 마커에 클릭 이벤트로 인포윈도우 https://apis.map.kakao.com/web/sample/multipleMarkerEvent/
  * url에서 섬네일 따기
  * 클릭한 마커로 지도 센터 이동 https://apis.map.kakao.com/web/sample/moveMap/
*/

async function setMap() {
	for (var i = 0; i < dataSet.length; i++) {
		let position = await getCoordsByAddress(dataSet[i].address);

		// 마커를 생성합니다
		var marker = new kakao.maps.Marker({
			map: map, // 마커를 표시할 지도
			position: position, // 마커를 표시할 위치
		});

		markerArray.push(marker);


		// 마커에 표시할 인포윈도우를 생성합니다
		var infowindow = new kakao.maps.InfoWindow({
			content: getContent(dataSet[i]), // 인포윈도우에 표시할 내용
			disableAutoPan: true, // 인포윈도우를 열 때 지도가 자동으로 패닝하지 않을지의 여부 (기본값: false)
		});

		infowindowArray.push(infowindow);

		// 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
		// 이벤트 리스너로는 클로저를 만들어 등록합니다
		// for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
		kakao.maps.event.addListener(
			marker,
			"click",
			makeOverListener(map, marker, infowindow, position)
		);
		// 커스텀: 맵을 클릭하면 현재 나타난 인포윈도우가 없어지게끔
		kakao.maps.event.addListener(map, "click", makeOutListener(infowindow));
	}
}

// 인포윈도우를 표시하는 클로저를 만드는 함수입니다
/* 
  커스텀
  1. 클릭시 다른 인포윈도우 닫기
  2. 클릭한 곳으로 지도 중심 이동하기
  */

function makeOverListener(map, marker, infowindow, position) {
	return function() {
		// 1. 클릭시 다른 인포윈도우 닫기
		closeInfowindow();
		infowindow.open(map, marker);
		// 2. 클릭한 곳으로 짇 중심 이동하기
		map.panTo(position);
	};
}

// 커스텀
// 1. 클릭시 다른 인포윈도우 닫기
let infowindowArray = [];
function closeInfowindow() {
	for (let infowindow of infowindowArray) {
		infowindow.close();
	}
}

// 인포윈도우를 닫는 클로저를 만드는 함수입니다
function makeOutListener(infowindow) {
	return function() {
		infowindow.close();
	};
}

// HTML 코드로 바꾸는 함수
function getContent(data) {
	let videoId = "";
	let replaceUrl = data.url;
	replaceUrl = replaceUrl.replace("https://youtu.be/", "");
	replaceUrl = replaceUrl.replace("https://www.youtube.com/embed/", "");
	replaceUrl = replaceUrl.replace("https://www.youtube.com/watch?v=", "");
	videoId = replaceUrl.split("&")[0];

	const result = `<div class="infowindow">
    <div class="infowindow-img-container">
      <img src="https://img.youtube.com/vi/${videoId}/sddefault.jpg" class="infowindow-img" alt="...">
    </div>
    <div class="infowindow-body">
      <h5 class="infowindow-title">${data.title}</h5>
      <p class="infowindow-text">${data.address}</p>
      <a href="https://youtu.be/${videoId}" target="_blank" class="infowindow-btn">영상이동</a>
    </div>
  </div>`;
	return result;
}

setMap(dataSet);



/*
**********************************************
5. 카테고리 분류
*/

async function setMap(dataSet) {
	for (var i = 0; i < dataSet.length; i++) {
		let position = await getCoordsByAddress(dataSet[i].address);

		// 마커를 생성합니다
		var marker = new kakao.maps.Marker({
			map: map, // 마커를 표시할 지도
			position: position, // 마커를 표시할 위치
		});

		markerArray.push(marker);

		// 마커에 표시할 인포윈도우를 생성합니다
		var infowindow = new kakao.maps.InfoWindow({
			content: getContent(dataSet[i]), // 인포윈도우에 표시할 내용
			disableAutoPan: true, // 인포윈도우를 열 때 지도가 자동으로 패닝하지 않을지의 여부 (기본값: false)
		});

		infowindowArray.push(infowindow);

		// 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
		// 이벤트 리스너로는 클로저를 만들어 등록합니다
		// for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
		kakao.maps.event.addListener(
			marker,
			"click",
			makeOverListener(map, marker, infowindow, position)
		);
		// 커스텀: 맵을 클릭하면 현재 나타난 인포윈도우가 없어지게끔
		kakao.maps.event.addListener(map, "click", makeOutListener(infowindow));
	}
}

//

const categoryList = document.querySelector(".category-list");

categoryList.addEventListener("click", categoryHandler);

// 카테고리
const categoryMap = {
	korea: "한식",
	china: "중식",
	japan: "일식",
	america: "양식",
	wheat: "분식",
	meat: "구이",
	sushi: "회/초밥",
	etc: "기타",
};

// 카테고리 클릭 핸들러
function categoryHandler(event) {
	const categoryId = event.target.id;
	const category = categoryMap[categoryId];

	// 데이터 분류
	let categorizedDataSet = [];
	for (let data of dataSet) {
		if (data.category === category) {
			categorizedDataSet.push(data);
		}
	}

	console.log(categorizedDataSet);

	// 기존 마커 삭제
	closeMarker();

	// 기존 인포윈도우 닫기
	closeInfowindow();
	// 실행
	setMap(categorizedDataSet);
}

// 기존 마커 삭제 함수
markerArray = [];
function closeMarker() {
	for (var i = 0; i < markerArray.length; i++) {
		markerArray[i].setMap(null);
	}
}