import {getOnlyKey} from "../utils";

const defaultCanvas = {
    // 页面样式
    style: {
        width: 320,
        height: 568,
        backgroundColor: "#ffffff",
        backgroundImage: "",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        // boxSizing: "content-box",
    },
    // 组件
    cmps: [],

    // // 仅用于测试
    // cmps: [
    //     {
    //         key: getOnlyKey(),
    //         desc: "文本",
    //         value: "文本",
    //         style: {
    //             position: "absolute",
    //             top: 0,
    //             left: 0,
    //             width: 100,
    //             height: 30,
    //             fontSize: 12,
    //             color: "red",
    //         },
    //     },
    // ],
};

// 状态
export default class Canvas {
    constructor(_canvas = defaultCanvas) {
        this.canvas = _canvas; // 页面数据

        // 被选中的组件下标
        this.selectedCmpIndex = null

        this.listeners = [];
    }

    // get
    getCanvas = () => {
        return {...this.canvas};
    };

    getCanvasCmps = () => {
        return [...this.canvas.cmps];
    };

    getSelectedCmpIndex = () => {
        return this.selectedCmpIndex
    }

    getSelectedCmp = () => {
        const cmps = this.getCanvasCmps()
        return cmps[this.selectedCmpIndex]
    }

    setSelectedCmpIndex = (index) => {
        if (this.selectedCmpIndex === index) {
            return
        }
        this.selectedCmpIndex = index

        this.updateApp()
    }

    // set
    setCanvas = (_canvas) => {
        Object.assign(this.canvas, _canvas);

        this.updateApp();

        // console.log("this", this.canvas); //sy-log
    };

    // 新增组件
    addCmp = (_cmp) => {
        const cmp = {key: getOnlyKey(), ..._cmp};
        // 1. 更新画布数据
        this.canvas.cmps.push(cmp);

        // 2. 选中新增的组件为选中值
        this.selectedCmpIndex = this.canvas.cmps.length - 1

        // 3. 更新组件
        this.updateApp();
    };

    updateSelectedCmp = (newStyle, newValue) => {
        const selectedCmp = this.getSelectedCmp()
        if (newStyle) {
            this.canvas.cmps[this.getSelectedCmpIndex()].style = {
                ...selectedCmp.style,
                ...newStyle,
            };
        }

        if (newValue != undefined) {
            this.canvas.cmps[this.getSelectedCmpIndex()].value = newValue;
        }


        this.updateApp();
    }

    updateCanvasStyle = (newStyle) => {
        this.canvas.style = {
            ...this.canvas.style,
            ...newStyle,
        };

        console.log("this", this.canvas.style); //sy-log
        this.updateApp();
    };

    updateApp = () => {
        // 希望组件更新
        this.listeners.forEach((lis) => lis());
    };

    subscribe = (listener) => {
        this.listeners.push(listener);
        // 取消时间
        return () => {
            this.listeners = this.listeners.filter((lis) => lis !== listener);
        };
    };

    getPublicCanvas = () => {
        const obj = {
            getCanvas: this.getCanvas,
            setCanvas: this.setCanvas,
            getCanvasCmps: this.getCanvasCmps,
            addCmp: this.addCmp,
            getSelectedCmpIndex: this.getSelectedCmpIndex,
            setSelectedCmpIndex: this.setSelectedCmpIndex,
            subscribe: this.subscribe,
            getSelectedCmp: this.getSelectedCmp,
            updateSelectedCmp: this.updateSelectedCmp,
            updateCanvasStyle: this.updateCanvasStyle,
        };

        return obj;
    };
}
