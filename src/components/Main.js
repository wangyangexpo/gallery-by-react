require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom'

let imageDatas = require('../data/imageData.json')

// 利用自执行函数 将图片名信息转成图片URL路径信息
imageDatas = function getImageURL(imageDatasArr) {
    for (var i = 0, j = imageDatasArr.length; i < j; i++) {
        var singleImg = imageDatasArr[i];
        singleImg.imageURL = require('../images/' + singleImg.fileName);
        imageDatasArr[i] = singleImg;
    }
    return imageDatasArr;
}(imageDatas);

class ImgFigure extends React.Component {
    render() {
        var styleObj = {};

        if(this.props.arrange.pos){
          styleObj = this.props.arrange.pos;
        }

        return ( <figure className = "img-figure" style={styleObj}>
            <img src={this.props.data.imageURL}
            alt={this.props.data.title} />
            <figcaption >
            <h2 className="img-title">{this.props.data.title}</h2>
            </figcaption>
            </figure>
        );
    }
}

class AppComponent extends React.Component {

        constructor(props) {
            super(props);
            this.state = {
                Constant: {
                    centerPos: {
                        left: 0,
                        top: 0
                    },
                    hPosRange: { // 水平方向取值范围
                        leftSecX: [0, 0],
                        rightSecX: [0, 0],
                        y: [0, 0]
                    },
                    vPosRange: { // 垂直方向取值范围
                        x: [0, 0],
                        topY: [0, 0]
                    }
                },
                imgsRangeArr: [
                    // {
                    //   pos: {
                    //     left: 0,
                    //     top: 0
                    //   }
                    // }
                ]
            }
        }

        // 获取区间的随机值
        getRangeRandom(low,high) {
          return Math.ceil(Math.random() * (high - low) + low);
        }
        //从新布局所有图片
        //centerIndex 是居中图片的index
        rearrange(centerIndex) {
            var imgsRangeArr = this.state.imgsRangeArr,
                Constant = this.state.Constant,
                centerPos = Constant.centerPos,
                hPosRange = Constant.hPosRange,
                vPosRange = Constant.vPosRange,
                hPosRangeLeftSecX = hPosRange.leftSecX,
                hPosRangeRightSecX = hPosRange.rightSecX,
                hPosRangeY = hPosRange.y,
                vPosRangeTopY = vPosRange.topY,
                vPosRangeX = vPosRange.x,
                _this = this,

                topImgNum = Math.floor(Math.random() * 2),
                topImgSpliceIndex = Math.ceil(Math.random() * (imgsRangeArr.length - topImgNum)),
                imgsArrangeTopArr = imgsRangeArr.splice(topImgSpliceIndex,topImgNum),

                //居中图片位置
                imgsArrangeCenterArr = imgsRangeArr.splice(centerIndex,1);
                imgsArrangeCenterArr[0].pos = centerPos;

                // 布局上侧的图片
                imgsArrangeTopArr.forEach(function(value,index){
                  imgsArrangeTopArr[index].pos = {
                    left: _this.getRangeRandom(vPosRangeX[0], vPosRangeX[1]),
                    top: _this.getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1])
                  }

                })

                // 布局左右两侧图片
                for(var i = 0, j = imgsRangeArr.length, k = j/2;i<j;i++){
                  var hPosRangeLORX = null;
                  if(i<k){
                      hPosRangeLORX = hPosRangeLeftSecX;
                  }else{
                      hPosRangeLORX = hPosRangeRightSecX;
                  }
                  imgsRangeArr[i].pos = {
                    top: _this.getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                    left: _this.getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
                  }
                }

                if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
                  imgsRangeArr.splice(topImgSpliceIndex, 0 ,imgsArrangeTopArr[0]);
                }

                imgsRangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

                _this.setState({
                  Constant:Constant,
                  imgsRangeArr: imgsRangeArr
                })

        }

        //组件加载完成之后初始化位置信息
        componentDidMount() {
            const Constant = this.state.Constant;
            //首先拿到舞台大小
            var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
                stageW = stageDOM.scrollWidth,
                stageH = stageDOM.scrollHeight,
                halfStageW = Math.ceil(stageW / 2),
                halfStageH = Math.ceil(stageH / 2);

            // 拿到一个imgFigure大小
            var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
                imgW = imgFigureDOM.scrollWidth,
                imgH = imgFigureDOM.scrollHeight,
                halfImgW = Math.ceil(imgW / 2),
                halfImgH = Math.ceil(imgH / 2);

            // 计算中心图片位置
            Constant.centerPos = {
                left: halfStageW - halfImgW,
                top: halfStageH - halfImgH
            }

            Constant.hPosRange.leftSecX[0] = -halfImgW;
            Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
            Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
            Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
            Constant.hPosRange.y[0] = -halfImgH;
            Constant.hPosRange.y[1] = stageH - halfImgH;
            Constant.vPosRange.topY[0] = -halfImgH;
            Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
            Constant.vPosRange.x[0] = halfStageW - imgW;
            Constant.vPosRange.x[1] = halfStageW;

            this.rearrange(0);

        }

        render() {
            var controllerUnits = [],
                imageFigures = [];
            var imgsRangeArr = this.state.imgsRangeArr;
            var _this = this;
            imageDatas.forEach(function(value, index) {
                    if(!imgsRangeArr[index]){
                      imgsRangeArr[index] = {
                        pos: {
                          left:0,
                          top: 0
                        }
                      }
                    }
                    imageFigures.push( <ImgFigure key = { index }
                        data = { value }
                        ref = { 'imgFigure' + index }
                        arrange = {_this.state.imgsRangeArr[index]}/>);
                    });

                return ( <section className = "stage"
                    ref = "stage" >
                      <section className = "img-sec">{imageFigures}</section>
                      <nav className = "controller-nav">{controllerUnits }</nav>
                    </section>
                );
            }
        }

        AppComponent.defaultProps = {};

        export default AppComponent;
