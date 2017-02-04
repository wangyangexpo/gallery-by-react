require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

let imageDatas = require('../data/imageData.json')

// 利用自执行函数 将图片名信息转成图片URL路径信息
imageDatas = function getImageURL(imageDatasArr) {
	for(var i = 0,j=imageDatasArr.length;i<j;i++){
		var singleImg = imageDatasArr[i];
		singleImg.imageURL = require('../images/' + singleImg.fileName);
		imageDatasArr[i] = singleImg;
	}
	return imageDatasArr;
}(imageDatas);

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
      	   <section className="img-sec">
      	   </section>
      	   <nav className="controller-nav">
      	   </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
