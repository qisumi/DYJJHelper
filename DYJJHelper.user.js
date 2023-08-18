// ==UserScript==
// @name         DYJJHelper
// @namespace    https://github.com/qisumi
// @version      0.2.0
// @description  Dao Yuan Jie Jie !
// @author       Qisumi
// @match        https://ywgl.seu.edu.cn/*
// @connect      ywgl.seu.edu.cn
// @match        https://infoplus.seu.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net.cn
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @run-at document-idle
// ==/UserScript==

(function () {
    'use strict';
    /* --------------------------------- 用户面板部分 --------------------------------- */

    /* -------------------------------------------------------------------------- */
    /*                         辅助实现用户面板的CSS                                */
    /* -------------------------------------------------------------------------- */
    let usercss = `
.accordion {
  background-color: #eee;
  color: #444;
  cursor: pointer;
  padding: 8px;
  width: 100%;
  text-align: left;
  border: none;
  outline: none;
  transition: 0.4s;
}
 
.active, .accordion:hover {
  background-color: #ccc;
}
 
.panel {
  padding: 5px;
  background-color: white;
  display: none;
  overflow: hidden;
}
 
#floating-panel {
  position: absolute;
  z-index: 9;
  background-color: #f1f1f1;
  border: 1px solid #d3d3d3;
  text-align: center;
  width: 200px;
}
 
#floating-panel-header {
  padding: 10px;
  cursor: move;
  z-index: 10;
  background-color: #2196F3;
  color: #fff;
}
.func {
  padding: 3px;
  cursor: pointer;
  border: 1px solid #d3d3d3;
}
`
    /* -------------------------------------------------------------------------- */
    /*                              用户面板内容                                   */
    /* -------------------------------------------------------------------------- */
    let floatingPanelHTML = `
    <div id="floating-panel">
        <div id="floating-panel-header">辅导员小助手</div>
        <div class="floating-panel-submodule">
            <button class="accordion">自动审批入校流程功能</button>
            <div class="panel">
              <div id="panel-1-func-0" class = "func">统计待审批个数</div>
              <div id="panel-1-func-1" class = "func">一键开始自动审批(有筛选)</div>
              <div id="panel-1-func-2" class = "func">一键开始自动审批(无条件)</div>
            </div>
        </div>
        <div class="floating-panel-submodule">
            <button class="accordion">功能等待开发</button>
            <div class="panel">
              <p>功能等待开发</p>
            </div>
        </div>
    </div>`

    /* -------------------------------------------------------------------------- */
    /*                              用户面板脚本                                   */
    /* -------------------------------------------------------------------------- */
    // 插入元素和样式表
    GM_addStyle(usercss);
    $("body").prepend(floatingPanelHTML)
    // 使 DIV 元素可拖动:
    dragElement(document.getElementById("floating-panel"));
    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt.id + "-header")) {
            // 如果存在，标题是您从中移动 DIV 的位置:
            document.getElementById(elmnt.id + "-header").onmousedown = dragMouseDown;
        } else {
            // 否则，从 DIV 内的任何位置移动 DIV:
            elmnt.onmousedown = dragMouseDown;
        }
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // 在启动时获取鼠标光标位置:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // 每当光标移动时调用一个函数:
            document.onmousemove = elementDrag;
        }
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // 计算新的光标位置:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // 设置元素的新位置:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // 释放鼠标按钮时停止移动:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // 使面板的不同功能可以折叠
    let acc = document.getElementsByClassName("accordion");
    let panel_selector;

    for (panel_selector = 0; panel_selector < acc.length; panel_selector++) {
        acc[panel_selector].addEventListener("click", function () {
            /* 在添加和删除 "active" 类之间切换，
            突出显示控制面板的按钮 */
            this.classList.toggle("active");

            /* 在隐藏和显示活动面板之间切换 */
            var panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        });
    }

    // 面板折叠功能
    let submodule_hide = false
    $("#floating-panel-header").dblclick(function () {
        if (submodule_hide)
            $(".floating-panel-submodule").show()
        else
            $(".floating-panel-submodule").hide()
        submodule_hide = !submodule_hide
    })


    /* -------------------------------------------------------------------------- */
    /*                             面板功能按钮绑定                                  */
    /* -------------------------------------------------------------------------- */

    let panel_1_func_1 = $("#panel-1-func-1")
    panel_1_func_1.on("click", function () {
        GM_setValue('DYJJHelper_autoSubmit', true)
        setTimeout(getUrls, 1000, filter)
    })
    let panel_1_func_2 = $("#panel-1-func-2")
    panel_1_func_2.on("click", function () {
        GM_setValue('DYJJHelper_autoSubmit', true)
        setTimeout(getUrls, 1000, () => true)
    })

    /* -------------------------------------------------------------------------- */


    /* -------------------------------- 脚本功能实现部分 -------------------------------- */
    /* -------------------------------------------------------------------------- */
    /*                        1. 入校申请自动审批功能                               */
    /* -------------------------------------------------------------------------- */
    function filter(item, idx, array) {
        // 这里编写审核通过的条件逻辑判断，需要注意的是在JS中，日期的月份是从0开始的
        let arriveGateTime = new Date(item.arrive_gate_time)
        let beginTime = new Date(2023, 7, 19)
        let endTime = new Date(2023, 7, 21)
        if (arriveGateTime < beginTime || arriveGateTime > endTime) {
            return false
        }
        return true
    }
    function getUrls(filter) {
        GM_xmlhttpRequest({
            url: "https://ywgl.seu.edu.cn/api/stureturn/bkslook/0",
            method: "POST",
            data: "filter=%7B%22student_id%22%3A%22%22%2C%22health_report%22%3Anull%2C%22status_code%22%3A%224%22%2C%22createTL%22%3Anull%2C%22createTR%22%3Anull%2C%22arriveTL%22%3Anull%2C%22arriveTR%22%3Anull%2C%22area_province%22%3Anull%2C%22area_city%22%3Anull%2C%22area%22%3Anull%7D&order=create_time",
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
                "sec-ch-ua": "\"Not/A)Brand\";v=\"99\", \"Microsoft Edge\";v=\"115\", \"Chromium\";v=\"115\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            onload: function (xhr) {
                let res = JSON.parse(xhr.responseText).response
                let items = res.filter(filter)
                items = items.map(item => {
                    return item.url
                })
                GM_log(items)
                let anchor_button = $('div.main button')
                if (anchor_button.length > 0) {
                    anchor_button.parent().append(`
                        <span style='margin-left:10px'>
                        存在<span style='font-weight:bold;color:red;'>${res.length}</span>个未审核的请求，其中满足预定义条件的有<span style='font-weight:bold;color:green;'>
                        ${items.length}</span>个</span>`)
                    GM_log("管理页面")
                    GM_setValue('DYJJHelper_autoSubmit', false)
                    return
                }
                if (GM_getValue('DYJJHelper_autoSubmit')) {
                    submit(items)
                }
            }
        });
    }
    function submit(items) {
        GM_log("审核页面")
        if (items.length === 0) {
            // 如果没有未审批，跳转回到管理页面
            window.location.href = 'https://ywgl.seu.edu.cn/bkslook'
        }
        let submit_btn = document.querySelectorAll("a.command_button_content")[0]
        if (submit_btn) {
            if (submit_btn.innerHTML !== '<nobr>审批通过</nobr>') {
                if (submit_btn.innerHTML.includes('<nobr>撤回</nobr>')) {
                    let newUrl = items.pop()
                    if (newUrl === window.location.href) {
                        newUrl = items.pop()
                    }
                    window.location.href = newUrl
                    return
                }
                GM_log("发生错误")
                return
            }
            submit_btn.click();
            setTimeout(() => {
                let ok_btn = document.querySelector('div.dialog_footer > button.dialog_button.default.fr')
                ok_btn.click()
                setTimeout(() => {
                    if (items.length === 1) {
                        // 如果这已经是最后一个需要审核的，直接跳转回到管理页面
                        window.location.href = 'https://ywgl.seu.edu.cn/bkslook'
                    }
                    let newUrl = items.pop()
                    if (newUrl === window.location.href) {
                        newUrl = items.pop()
                    }
                    window.location.href = newUrl
                }, 1000)
            }, 1000);
        } else {
            setTimeout(submit, 1000)
        }
    }
    /* -------------------------------------------------------------------------- */
})();