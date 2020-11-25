## BumBlog - Beta (블로그 사이트)

#### 1. 프로그램의 특징

* Node JS 서버 기반으로 작성된 토이프로젝트 입니다.
* 프론트 : ReactJS / 백엔드 : NestJS / 통신: GraphQL + RESTful API / DB : MySQL로 되어있습니다.
* 전 영역 (프론트 + 백엔드) TypeScript로 개발되어 있습니다.

#### 2. 사용 기술

##### Front-End
* ReactJS (create-react-app framework)
* Redux
* SCSS
* axios
* apollo-client
* react-router-dom
  
##### Back-End
* nestJS
  
##### DataBase
* MySQL 
  
##### 기타
* TypeScript (언어)

#### 3. 실행 방법.

npm 모듈을 모두 설치 후 npm run dev:start <br />

##### 설치 (sever폴더 별도 설치 필요)

1. cd bumblog
2. npm install
3. cd server
4. npm install
 
##### 실행

 * 개발 모드
   * npm run start:dev
   * 자동으로 http://localhost:3000 에서 앱 실행
 
 * 배포 모드
   * npm run build
   * ./build (프론트), web.js (백엔드) 로 번들링.
   * http://localhost:8000 에서 앱 확인 가능
   
 * 배포 실행
   * npm start
 
 
