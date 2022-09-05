<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>맛집 리스트</title>
  <meta name="author" content="이민준" />
  <meta name="description" content="맛집지도 서비스" />
  <meta name="keywords" content="맛집,근처,연수원" />
  <link rel="stylesheet" href="position.css" />
  <link rel="stylesheet" href="map.css" />
</head>

<body>
  <nav>
    <div class="inner">
      <div class="nav-container">
        <h1 class="nav-title">맛집지도 리스트</h1>
        <button class="nav-contact">Contact</button>
      </div>
    </div>
  </nav>

  <main>
    <section id="category">
      <div class="inner">
        <div class="category-container">
          <h2 class="category-title">맛집 지도 카테고리를 선택해보세요</h2>
          <div class="category-list">
            <button class="category-item" id="korea">한식</button>
            <button class="category-item" id="china">중식</button>
            <button class="category-item" id="japan">일식</button>
            <button class="category-item" id="america">양식</button>
            <button class="category-item" id="wheat">분식</button>
            <button class="category-item" id="meat">구이</button>
            <button class="category-item" id="sushi">회/초밥</button>
            <button class="category-item" id="etc">기타</button>
          </div>
        </div>
      </div>
    </section>
    <!-- 카테고리 -->
    <div id="map" class="inner"></div>

    <!-- 카카오지도 -->
  </main>
  <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=0515c39eb2a22c7386c08457544a8ecc&libraries=services"></script>
  <script src="script.js"></script>
</body>
</html>