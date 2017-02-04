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

    handleClick(e) {
        if(this.props.arrange.isCenter){
            this.props.inverse();
        } else {
            this.props.center();
        }

        e.stopPropagation();
        e.preventDefault();
    }

    render() {
        var _this = this;
        var styleObj = {};

        if(this.props.arrange.pos){
          styleObj = this.props.arrange.pos;
        }

        // 添加旋转角度
        if(this.props.arrange.rotate){
          (['MozTransform','msTransform','WebkitTransform','transform']).forEach(function(value){
              styleObj[value] = 'rotate(' + _this.props.arrange.rotate + 'deg)';
          })
        }

        if(this.props.arrange.isCenter){
          styleObj.zIndex = 11;
        }

        var imgFigureClassName = 'img-figure';
            imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

        return ( <figure className = {imgFigureClassName} style={styleObj} onClick={this.handleClick.bind(this)}>
            <img src={this.props.data.imageURL}
            alt={this.props.data.title} />
            <figcaption >
            <h2 className="img-title">{this.props.data.title}</h2>
            <div className="img-back" onClick={this.handleClick.bind(this)}>
                <p>
                    {this.props.data.desc}
                </p>
            </div>
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
                    //   },
                    //   rotate: 0,
                    //   isInverse: false,
                    //   isCenter: false
                    // }
                ]
            }
        }

        // 获取区间的随机值
        getRangeRandom(low,high) {
          return Math.ceil(Math.random() * (high - low) + low);
        }

        // 获取0 - 30 度之间的任意正负值旋转角度
        get30dDegRandom() {
            return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
        }

        // 翻转图片 index是传入的要翻转的图片index
        // 只是一个闭包函数
        inverse(index) {
           var _this = this;
           return function() {
               var imgsRangeArr = _this.state.imgsRangeArr;
               var Constant = _this.state.Constant;
               imgsRangeArr[index].isInverse = !imgsRangeArr[index].isInverse;

               _this.setState({
                  Constant: Constant,
                  imgsRangeArr: imgsRangeArr
               })

           }
        }

        // 从新居中点击的图片
        center(index) {
          var _this = this;
          return function(){
              _this.rearrange(index);
          }

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
                imgsArrangeCenterArr[0] = {
                  pos: centerPos,
                  rotate: 0,
                  isCenter: true
                }

                // 布局上侧的图片
                imgsArrangeTopArr.forEach(function(value,index){
                  imgsArrangeTopArr[index] = {
                      pos: {
                        left: _this.getRangeRandom(vPosRangeX[0], vPosRangeX[1]),
                        top: _this.getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1])
                      },
                      rotate: _this.get30dDegRandom(),
                      isCenter: false
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
                  imgsRangeArr[i] = {
                    pos: {
                        top: _this.getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                        left: _this.getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
                    },
                    rotate: _this.get30dDegRandom(),
                    isCenter: false
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
                        },
                        rotate: 0,
                        isInverse: false,
                        isCenter: false
                      }
                    }
                    imageFigures.push( <ImgFigure key = { index }
                        data = { value }
                        ref = { 'imgFigure' + index }
                        arrange = {_this.state.imgsRangeArr[index]} inverse={_this.inverse(index)}
                        center = {_this.center(index)}/>);
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
