// ==UserScript==
// @name         DarknessGod Ultimate Auto-Solver
// @namespace    http://tampermonkey.net/
// @version      13.0
// @description  Fix kéo thả thật (HTML5 Drag Events), giải 100% các dạng bài ELTNGL / Avallain
// @author       DarknessGod
// @match        *://*.learn.eltngl.com/*
// @match        *://*.avallain.net/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700&display=swap');
        #ollie-fab {
            position: fixed; bottom: 30px; left: 30px; z-index: 999998;
            width: 60px; height: 60px; border-radius: 50%;
            background: #1a202c; color: #ff7e67;
            font-size: 28px; display: flex; justify-content: center; align-items: center;
            cursor: pointer; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
            user-select: none;
        }
        #ollie-fab:hover { transform: scale(1.1); color: #ff5c40; }
        #ollie-fab:active { transform: scale(0.95); }

        #ollie-ui {
            position: fixed; bottom: 100px; left: 30px; width: 460px;
            background: #f0f4f8; border-radius: 24px; z-index: 999999;
            font-family: 'Quicksand', sans-serif; color: #2d3748;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255,255,255,0.6);
            display: flex; flex-direction: column;
            transform-origin: bottom left;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            opacity: 1; visibility: visible;
            resize: both; overflow: auto;
        }
        #ollie-ui.hidden { transform: scale(0); opacity: 0; visibility: hidden; pointer-events: none; }

        .ollie-header {
            background: #1a202c; padding: 14px 18px; border-radius: 24px 24px 0 0;
            display: flex; justify-content: space-between; align-items: center;
            cursor: move; user-select: none; gap: 8px;
        }
        .ollie-header span { font-weight: 700; font-size: 1.05rem; color: #ff7e67; display: flex; align-items: center; gap: 6px; white-space: nowrap; }
        .dg-actions { display: flex; align-items: center; gap: 6px; }
        .dg-btn {
            background: rgba(255,255,255,0.1); border: none; width: 28px; height: 28px; border-radius: 50%;
            cursor: pointer; font-weight: bold; color: #cbd5e1;
            display: flex; justify-content: center; align-items: center; font-size: 13px;
            transition: all 0.2s;
        }
        .dg-btn:hover { background: rgba(255,255,255,0.25); color: #fff; }
        .dg-solve-btn {
            background: linear-gradient(135deg, #10b981, #059669); border: none;
            padding: 5px 12px; border-radius: 999px; cursor: pointer;
            font-weight: 700; color: #fff; font-size: 12px; font-family: 'Quicksand', sans-serif;
            box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4); transition: transform 0.15s;
        }
        .dg-solve-btn:hover { transform: scale(1.05); }
        .dg-solve-btn:active { transform: scale(0.95); }
        .ollie-close:hover { background: #ef4444; color: #fff; }

        .ollie-content {
            padding: 18px; max-height: 62vh; overflow-y: auto; font-size: 14px; line-height: 1.5;
            scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent;
        }
        .ollie-content::-webkit-scrollbar { width: 6px; }
        .ollie-content::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }

        .screen-badge {
            display: inline-block; background: #1a202c; color: #38bdf8;
            font-size: 11px; font-weight: 700; padding: 2px 9px; border-radius: 999px;
            margin-bottom: 6px; letter-spacing: 0.4px;
        }

        .q-box {
            background: #ffffff; padding: 14px; border-radius: 16px; margin-bottom: 14px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04); border: 1px solid #e2e8f0;
            animation: slideIn 0.25s ease forwards;
        }
        .q-text { font-size: 13px; color: #475569; font-weight: 700; margin-bottom: 10px; line-height: 1.4;}

        .a-pair {
            display: flex; align-items: center; gap: 10px; margin-bottom: 8px;
            background: #f8fafc; padding: 8px 10px; border-radius: 12px; border: 1px solid #e2e8f0;
        }
        .a-item {
            background: #d1fae5; color: #065f46; padding: 6px 10px;
            border-radius: 8px; font-weight: 700; font-size: 13.5px;
            word-break: break-word; flex: 1;
        }
        .a-item.cat { background: #fef3c7; color: #92400e; }
        .a-arrow { color: #ff7e67; font-size: 18px; font-weight: bold; }

        .a-text {
            display: inline-block; background: #fef3c7; color: #92400e; padding: 7px 14px;
            border-radius: 10px; font-weight: 700; font-size: 14.5px;
            border: 1px solid #fde68a;
            word-break: break-word; margin: 4px 5px 4px 0;
        }
        .a-hl {
            display: block; background: #fef08a; color: #713f12; padding: 8px 12px;
            border-radius: 10px; font-weight: 700; font-size: 13.5px;
            border-left: 4px solid #eab308;
            box-shadow: 0 2px 4px rgba(0,0,0,0.04);
            word-break: break-word; margin-bottom: 6px;
        }

        @keyframes slideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

        .loader {
            border: 4px solid #e2e8f0; border-top: 4px solid #ff7e67; border-radius: 50%;
            width: 30px; height: 30px; animation: spin 1s linear infinite; margin: 10px auto;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    `;
    document.head.appendChild(style);

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    let parsedScreens = [];

    function createUI() {
        if (document.getElementById('ollie-ui')) return;

        const fab = document.createElement('div');
        fab.id = 'ollie-fab';
        fab.innerHTML = '⚡';
        fab.title = 'DarknessGod Answer Key';

        const ui = document.createElement('div');
        ui.id = 'ollie-ui';
        ui.innerHTML = `
            <div class="ollie-header" id="ollie-drag-header">
                <span>DarknessGod ⚡ <span class="dg-status" style="font-size:12px; color:#94a3b8; font-weight:normal;">(Auto)</span></span>
                <div class="dg-actions">
                    <button class="dg-solve-btn" id="dg-auto-solve" title="Tự động giải toàn bộ bài hiện tại">🤖 Auto Giải Hết</button>
                    <button class="dg-btn dg-reload" title="Quét lại đáp án">🔄</button>
                    <button class="dg-btn ollie-close" title="Thu gọn">✕</button>
                </div>
            </div>
            <div class="ollie-content" id="ollie-content">
                <div class="loader"></div>
            </div>
        `;
        document.body.appendChild(fab);
        document.body.appendChild(ui);

        fab.onclick = () => ui.classList.toggle('hidden');
        ui.querySelector('.ollie-close').onclick = () => ui.classList.add('hidden');
        ui.querySelector('.dg-reload').onclick = () => processXML();
        ui.querySelector('#dg-auto-solve').onclick = () => runFullAutoSolve();

        const header = document.getElementById('ollie-drag-header');
        let isDragging = false;
        let offsetX, offsetY;

        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.dg-btn') || e.target.closest('.dg-solve-btn')) return;
            isDragging = true;
            offsetX = e.clientX - ui.getBoundingClientRect().left;
            offsetY = e.clientY - ui.getBoundingClientRect().top;
            header.style.cursor = 'grabbing';
            ui.style.transition = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            ui.style.left = (e.clientX - offsetX) + 'px';
            ui.style.top = (e.clientY - offsetY) + 'px';
            ui.style.bottom = 'auto';
            ui.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                header.style.cursor = 'move';
                ui.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            }
        });
    }

    function removeUI() {
        const fab = document.getElementById('ollie-fab');
        const ui = document.getElementById('ollie-ui');
        if (fab) fab.remove();
        if (ui) ui.remove();
    }

    function getTags(root, tagName) {
        let list = Array.from(root.getElementsByTagName(tagName));
        if (list.length === 0) list = Array.from(root.getElementsByTagNameNS('*', tagName));
        return list;
    }

    function getAllDocs() {
        const docs = [document];
        function scanIframes(win) {
            try {
                win.document.querySelectorAll('iframe').forEach(f => {
                    try {
                        if (f.contentDocument) {
                            docs.push(f.contentDocument);
                            scanIframes(f.contentWindow);
                        }
                    } catch (e) {}
                });
            } catch (e) {}
        }
        scanIframes(window);
        return docs;
    }

    function cleanText(el) {
        if (!el) return '';
        let clone = el.cloneNode(true);
        clone.querySelectorAll('feedbackInline, feedbackBlock, script, style, select, option, button, .sr-only, .visually-hidden, [class*="transcript"], [class*="rubric"]').forEach(n => n.remove());
        let txt = clone.textContent.replace(/\s+/g, ' ').trim();
        txt = txt.replace(/\d+\.\s*Marking\s*\d+\..*$/i, '').replace(/Transcript.*$/i, '').trim();
        return txt;
    }

    function cleanAnswerString(str) {
        if (!str) return '';
        let cleaned = str.replace(/^\*+/, '').trim();
        if (cleaned.includes('|')) {
            cleaned = cleaned.split('|')[0].replace(/^\*+/, '').trim();
        }
        return cleaned;
    }

    function attachLineNumber(el, wordText) {
        if (!el || !wordText) return wordText;
        const lineContainer = el.closest('li, tr, p, div[class*="item"], div[class*="line"], div[class*="row"]');
        if (lineContainer) {
            const lineTxt = cleanText(lineContainer);
            const numMatch = lineTxt.match(/^(\d+)[\.\)]/);
            if (numMatch && !wordText.startsWith(`Câu ${numMatch[1]}:`)) {
                return `Câu ${numMatch[1]}: "${wordText}"`;
            }
        }
        return wordText;
    }

    function simulateRealClick(el) {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const win = el.ownerDocument.defaultView;
        const opts = { bubbles: true, cancelable: true, view: win, clientX: cx, clientY: cy, button: 0, buttons: 1 };

        try { el.dispatchEvent(new PointerEvent('pointerdown', opts)); } catch (e) {}
        el.dispatchEvent(new MouseEvent('mousedown', opts));
        try { el.dispatchEvent(new PointerEvent('pointerup', { ...opts, buttons: 0 })); } catch (e) {}
        el.dispatchEvent(new MouseEvent('mouseup', { ...opts, buttons: 0 }));
        el.dispatchEvent(new MouseEvent('click', { ...opts, buttons: 0 }));
    }

    // Hàm kéo thả mô phỏng HTML5 Drag & Drop chuẩn cho Avallain
    async function simulateRealDragAndDrop(sourceEl, targetEl) {
        if (!sourceEl || !targetEl) return;

        const realSource = sourceEl.closest('.ui-draggable, [draggable="true"], .tile, .gapText, .word') || sourceEl;
        const realTarget = targetEl.closest('.ui-droppable, .gap, .dropzone, .target, [class*="drop"]') || targetEl;

        const doc = realSource.ownerDocument;
        const win = doc.defaultView;

        // Tạo DataTransfer object
        let dt;
        try {
            dt = new DataTransfer();
        } catch (e) {
            dt = new ClipboardEvent('').clipboardData;
        }

        if (dt) {
            try { dt.setData('text/plain', realSource.textContent.trim()); } catch(e){}
        }

        const sRect = realSource.getBoundingClientRect();
        const tRect = realTarget.getBoundingClientRect();

        const sOpts = { bubbles: true, cancelable: true, view: win, clientX: sRect.left + sRect.width/2, clientY: sRect.top + sRect.height/2 };
        const tOpts = { bubbles: true, cancelable: true, view: win, clientX: tRect.left + tRect.width/2, clientY: tRect.top + tRect.height/2 };

        // 1. Kích hoạt dragstart ở nguồn
        try {
            const dragStartEvt = new DragEvent('dragstart', { ...sOpts, dataTransfer: dt });
            realSource.dispatchEvent(dragStartEvt);
        } catch (e) {
            console.log("DragEvent not supported, falling back to click", e);
        }
        await sleep(50);

        // 2. Kích hoạt dragenter và dragover ở đích
        try {
            const dragEnterEvt = new DragEvent('dragenter', { ...tOpts, dataTransfer: dt });
            realTarget.dispatchEvent(dragEnterEvt);
            await sleep(30);

            const dragOverEvt = new DragEvent('dragover', { ...tOpts, dataTransfer: dt });
            realTarget.dispatchEvent(dragOverEvt);
        } catch(e) {}
        await sleep(50);

        // 3. Thả (drop) ở đích
        try {
            const dropEvt = new DragEvent('drop', { ...tOpts, dataTransfer: dt });
            realTarget.dispatchEvent(dropEvt);
        } catch(e) {}
        await sleep(50);

        // 4. Kích hoạt dragend ở nguồn
        try {
            const dragEndEvt = new DragEvent('dragend', { ...sOpts, dataTransfer: dt });
            realSource.dispatchEvent(dragEndEvt);
        } catch(e) {}
        await sleep(50);

        // CÁCH 2: Nếu HTML5 Drag đéo ăn (do web chặn), dùng Click-to-place (Accessibility mode)
        if (!cleanText(realTarget) || realTarget.textContent.trim() === '') {
            simulateRealClick(realSource);
            await sleep(70);
            simulateRealClick(realTarget);
            await sleep(50);
        }
    }

    function fillInputBox(el, value) {
        if (!el || value == null) return false;
        el.focus();
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            const proto = el.tagName === 'INPUT' ? window.HTMLInputElement.prototype : window.HTMLTextAreaElement.prototype;
            const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
            if (setter) setter.call(el, value);
            else el.value = value;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            el.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Enter' }));
            el.blur();
            return true;
        }
        if (el.isContentEditable || el.getAttribute('contenteditable') === 'true' || el.classList.contains('gap-input')) {
            el.textContent = value;
            el.innerText = value;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            el.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: ' ' }));
            el.blur();
            return true;
        }
        return false;
    }

    function findElementByCode(root, code) {
        if (!code) return null;
        const baseCode = code.replace(/_\d+$/, '');
        const all = root.querySelectorAll('*');
        for (let el of all) {
            if (!el.attributes) continue;
            for (let attr of el.attributes) {
                const v = attr.value.trim();
                if (v === code || v === baseCode || new RegExp(`(?:^|[_\\-\\s])(?:${code}|${baseCode})(?:$|[_\\-\\s])`).test(v)) {
                    return el;
                }
            }
        }
        return null;
    }

    async function runFullAutoSolve() {
        const allDocs = getAllDocs();
        const btn = document.getElementById('dg-auto-solve');
        if (btn) btn.innerHTML = '⏳ Đang giải...';

        let totalSolved = 0;

        for (const doc of allDocs) {
            let activeRoot = doc;
            const screens = Array.from(doc.querySelectorAll('.screen, .step, [data-screen], [class*="screen-"]'))
                .filter(s => s.offsetParent !== null);
            let screenIdx = 0;

            if (screens.length > 0) {
                activeRoot = screens[0];
                const allScreenNodes = Array.from(doc.querySelectorAll('.screen, .step, [data-screen], [class*="screen-"]'));
                const foundIdx = allScreenNodes.indexOf(activeRoot);
                if (foundIdx >= 0) screenIdx = foundIdx;
            }

            const screenData = parsedScreens[screenIdx] || parsedScreens[0];
            if (!screenData) continue;

            const actions = screenData.actions;

            // 1. ĐIỀN TỪ TỰ DO
            const textActions = actions.filter(a => a.type === 'text');
            if (textActions.length > 0) {
                const editableBoxes = Array.from(activeRoot.querySelectorAll('input[type="text"]:not([disabled]), [contenteditable="true"], .text-entry, [class*="textEntry"] input, [class*="gap-input"]'))
                    .filter(el => el.offsetParent !== null);

                editableBoxes.forEach((box, idx) => {
                    const action = textActions[idx];
                    if (action && fillInputBox(box, action.value)) {
                        totalSolved++;
                    }
                });
            }

            // 2. DROPDOWN & TRẮC NGHIỆM
            const choiceActions = actions.filter(a => a.type === 'choice');
            if (choiceActions.length > 0) {
                const selects = Array.from(activeRoot.querySelectorAll('select:not([disabled])')).filter(el => el.offsetParent !== null);
                if (selects.length > 0) {
                    selects.forEach((sel, idx) => {
                        const action = choiceActions[idx];
                        if (!action) return;
                        for (let opt of sel.options) {
                            if (opt.value === action.rawId || opt.text.trim() === action.value) {
                                sel.value = opt.value;
                                sel.dispatchEvent(new Event('change', { bubbles: true }));
                                totalSolved++;
                                break;
                            }
                        }
                    });
                } else {
                    for (const action of choiceActions) {
                        let target = findElementByCode(activeRoot, action.rawId);
                        if (!target || target.offsetParent === null) {
                            const candidates = Array.from(activeRoot.querySelectorAll('label, .choice, [class*="choice"], li, button, span'))
                                .filter(el => el.offsetParent !== null && cleanText(el) === action.value);
                            target = candidates[0];
                        }
                        if (target) {
                            simulateRealClick(target);
                            totalSolved++;
                            await sleep(50);
                        }
                    }
                }
            }

            // 3. TÔ MÀU HIGHLIGHT
            const hlActions = actions.filter(a => a.type === 'highlight');
            if (hlActions.length > 0) {
                const penBtn = activeRoot.querySelector('[data-identifier^="GT"], .highlighter, [class*="highl
                                                        if (penBtn) {
                    simulateRealClick(penBtn);
                    await sleep(120);
                }

                const fallbackGaps = Array.from(activeRoot.querySelectorAll('[data-gap], .gap, .highlightable, [class*="highlight"], [class*="hottext"]'))
                    .filter(el => el.offsetParent !== null && !el.closest('#ollie-ui'));

                for (const action of hlActions) {
                    for (const code of action.codes) {
                        let target = findElementByCode(activeRoot, code);
                        if (!target || target.offsetParent === null) {
                            const gIdx = parseInt(code.replace('G', ''), 10);
                            if (fallbackGaps[gIdx]) target = fallbackGaps[gIdx];
                        }
                        if (target && target.offsetParent !== null) {
                            const clickTarget = (!cleanText(target) && target.nextElementSibling) ? target.nextElementSibling : target;
                            simulateRealClick(clickTarget);
                            totalSolved++;
                            await sleep(55);
                        }
                    }
                }
            }

            // 4. KÉO THẢ VÀO Ô TRỐNG / PHÂN LOẠI
            const pairActions = actions.filter(a => a.type === 'pair');
            if (pairActions.length > 0) {
                const fallbackDropGaps = Array.from(activeRoot.querySelectorAll('.ui-droppable, .gap, [data-gap], [data-identifier^="ID"], .dropzone, [class*="gap-box"], [class*="drop"]'))
                    .filter(el => el.offsetParent !== null && !el.closest('#ollie-ui') && !el.classList.contains('ui-draggable'));

                const filledTargets = new Set();

                for (const action of pairActions) {
                    if (filledTargets.has(action.catId)) continue;

                    let tileEl = findElementByCode(activeRoot, action.tileId);
                    if ((!tileEl || tileEl.offsetParent === null) && action.tileText) {
                        tileEl = Array.from(activeRoot.querySelectorAll('.ui-draggable, .tile, .gapText, [class*="tile"], [class*="drag"], [class*="word"], li, span, div'))
                            .find(el => el.offsetParent !== null && !el.closest('#ollie-ui') && !el.closest('.ui-droppable') && cleanText(el) === action.tileText);
                    }

                    let catEl = findElementByCode(activeRoot, action.catId);
                    if ((!catEl || catEl.offsetParent === null) && /^ID\d+$/i.test(action.catId)) {
                        const gapIdx = parseInt(action.catId.replace(/\D/g, ''), 10);
                        if (fallbackDropGaps[gapIdx]) catEl = fallbackDropGaps[gapIdx];
                    }
                    if ((!catEl || catEl.offsetParent === null) && action.catText) {
                        catEl = Array.from(activeRoot.querySelectorAll('.ui-droppable, .gap, .dropzone, [class*="drop"], [class*="target"], td, div'))
                            .find(el => el.offsetParent !== null && !el.closest('#ollie-ui') && cleanText(el).includes(action.catText));
                    }

                    if (tileEl && catEl && tileEl.offsetParent !== null && catEl.offsetParent !== null) {
                        filledTargets.add(action.catId);
                        await simulateRealDragAndDrop(tileEl, catEl);
                        totalSolved++;
                    }
                }
            }
        }

        if (btn) {
            btn.innerHTML = totalSolved > 0 ? `✅ Đã giải (${totalSolved})` : '⚠️ Không khớp ô';
            setTimeout(() => { btn.innerHTML = '🤖 Auto Giải Hết'; }, 2200);
        }
    }

    function processXML() {
        const contentDiv = document.getElementById('ollie-content');
        if (!contentDiv) return;

        let foundData = null;
        if (window.ajaxData) {
            foundData = window.ajaxData;
        } else {
            const iframes = document.querySelectorAll('iframe');
            for (let iframe of iframes) {
                try {
                    if (iframe.contentWindow && iframe.contentWindow.ajaxData) {
                        foundData = iframe.contentWindow.ajaxData;
                        break;
                    }
                } catch (e) {}
            }
        }

        if (!foundData) {
            contentDiv.innerHTML = '<div style="color: #ef4444; text-align:center;">Không tìm thấy data. Bấm 🔄 hoặc F5 lại trang nhé.</div>';
            return;
        }

        const xmlKeys = Object.keys(foundData)
            .filter(k => k.toLowerCase().includes('.xml') && typeof foundData[k] === 'string')
            .sort();

        if (xmlKeys.length === 0) {
            contentDiv.innerHTML = '<div style="color: #ef4444; text-align:center;">Không tìm thấy file XML.</div>';
            return;
        }

        try {
            const parser = new DOMParser();
            const xmlDocs = [];

            for (let key of xmlKeys) {
                const doc = parser.parseFromString(foundData[key], "text/xml");
                const nodes = getTags(doc, "responseDeclaration");
                if (nodes.length > 0) {
                    xmlDocs.push({ key, doc, responseNodes: nodes });
                }
            }

            if (xmlDocs.length === 0) {
                contentDiv.innerHTML = '<div style="text-align:center; color:#718096; font-weight:bold;">Bài này không có dữ liệu đáp án trong XML.</div>';
                return;
            }

            const allDocs = getAllDocs();
            const globalDomIdMap = {};
            parsedScreens = [];

            allDocs.forEach(doc => {
                doc.querySelectorAll('*').forEach(el => {
                    if (!el.attributes) return;
                    for (let attr of el.attributes) {
                        const matches = attr.value.match(/\b(?:[A-Z0-9]+_)?((?:GTID|ID|G|T|C|GT|H|A|B)\d+(?:_\d+)?)\b/g);
                        if (!matches) continue;

                        matches.forEach(rawMatch => {
                            const code = rawMatch;
                            const baseCode = rawMatch.replace(/_\d+$/, '');
                            if (globalDomIdMap[code]) return;

                            let text = cleanText(el);
                            if (!text && el.nextSibling && el.nextSibling.nodeType === 3) {
                                text = el.nextSibling.textContent.trim().split(/\s+/)[0];
                            }
                            if (!text && el.nextElementSibling) {
                                text = cleanText(el.nextElementSibling);
                            }
                            if (!text && el.cellIndex !== undefined && el.cellIndex >= 0) {
                                const table = el.closest('table');
                                const th = table ? table.querySelectorAll('th')[el.cellIndex] : null;
                                if (th) text = cleanText(th);
                            }

                            if (text && text.length < 200) {
                                const formatted = attachLineNumber(el, text);
                                globalDomIdMap[code] = formatted;
                                if (!globalDomIdMap[baseCode]) globalDomIdMap[baseCode] = formatted;
                            }
                        });
                    }
                });

                const highlightTargets = doc.querySelectorAll('[data-gap], .gap, .highlightable, [class*="highlight"], [class*="hottext"]');
                if (highlightTargets.length > 0) {
                    highlightTargets.forEach((el, index) => {
                        const gKey = 'G' + index;
                        let text = cleanText(el);
                        if (!text && el.nextSibling && el.nextSibling.nodeType === 3) {
                            text = el.nextSibling.textContent.trim().split(/\s+/)[0];
                        }
                        if (text && !globalDomIdMap[gKey]) {
                            globalDomIdMap[gKey] = attachLineNumber(el, text);
                        }
                    });
                }
            });

            let html = '';
            let globalQuestionIndex = 0;
            const isMultiScreen = xmlDocs.length > 1;

            xmlDocs.forEach((entry, screenIdx) => {
                const { doc: xmlDoc, responseNodes } = entry;
                const localIdMap = { ...globalDomIdMap };
                const screenActions = [];

                xmlDoc.querySelectorAll('[identifier], [id]').forEach(el => {
                    const id = el.getAttribute('identifier') || el.getAttribute('id');
                    if (!id) return;
                    let text = cleanText(el);
                    if (text) {
                        localIdMap[id] = text;
                        if (!localIdMap[id + '_0']) localIdMap[id + '_0'] = text;
                        if (!localIdMap[id + '_1']) localIdMap[id + '_1'] = text;
                    }
                });

                const xmlGaps = getTags(xmlDoc, 'gap');
                xmlGaps.forEach((gapEl, idx) => {
                    const id = gapEl.getAttribute('identifier') || ('G' + idx);
                    if (localIdMap[id]) return;

                    let word = '';
                    if (gapEl.nextSibling && gapEl.nextSibling.nodeType === 3) {
                        word = gapEl.nextSibling.textContent.trim().split(/\s+/)[0];
                    }
                    const parentBlock = gapEl.closest('p, li, div, td');
                    if (parentBlock) {
                        const blockTxt = cleanText(parentBlock);
                        const numMatch = blockTxt.match(/^(\d+)[\.\)]/);
                        if (parentBlock.querySelectorAll('gap').length === 1 && blockTxt) {
                            localIdMap[id] = blockTxt;
                        } else if (word) {
                            localIdMap[id] = numMatch ? `Câu ${numMatch[1]}: "${word}"` : `"${word}"`;
                        }
                    }
                });

                const xmlPrompts = Array.from(xmlDoc.querySelectorAll('itemBody p, itemBody div.contentblock, itemBody li'))
                    .map(el => {
                        let clone = el.cloneNode(true);
                        clone.querySelectorAll('textEntryInteraction, inlineChoiceInteraction').forEach(n => n.replaceWith(' [___] '));
                        return cleanText(clone);
                    })
                    .filter(t => t.includes('[___]') || t.length > 10);

                for (let i = 0; i < responseNodes.length; i++) {
                    const resp = responseNodes[i];
                    const respId = resp.getAttribute("identifier");

                    let rawAnswers = [];
                    getTags(resp, "value").forEach(v => {
                        const t = v.textContent.trim();
                        if (t && !rawAnswers.includes(t)) rawAnswers.push(t);
                    });
                    getTags(resp, "mapEntry").forEach(m => {
                        const key = (m.getAttribute("mapKey") || "").trim();
                        const mappedVal = parseFloat(m.getAttribute("mappedValue") || "1");
                        if (key && mappedVal > 0 && !rawAnswers.includes(key)) {
                            rawAnswers.push(key);
                        }
                    });

                    let qText = isMultiScreen
                        ? `Screen ${screenIdx + 1} • Ô ${i + 1}`
                        : `Câu ${globalQuestionIndex + 1}`;

                    if (xmlPrompts[i]) {
                        qText = xmlPrompts[i].substring(0, 115) + (xmlPrompts[i].length > 115 ? "..." : "");
                    }
                    globalQuestionIndex++;

                    let answerHTML = '';

                    if (rawAnswers.length > 0) {
                        const displayedAnswers = new Set();

                        for (let correctId of rawAnswers) {
                            let answerText = "";
                            let isChoice = false;

                            let interactionNode = xmlDoc.querySelector(`[responseIdentifier="${respId}"]`);
                            if (interactionNode) {
                                let choiceNode = interactionNode.querySelector(`[identifier="${correctId}"]`);
                                if (choiceNode) {
                                    answerText = cleanText(choiceNode);
                                    isChoice = true;
                                }
                            }

                            if (!answerText && localIdMap[correctId]) {
                                answerText = localIdMap[correctId];
                                isChoice = true;
                            }

                            if (!answerText && correctId.includes(' ')) {
                                let parts = correctId.split(/\s+/);

                                if (parts.some(p => /^G\d+$/.test(p))) {
                                    const gCodes = parts.filter(p => /^G\d+$/.test(p));
                                    screenActions.push({ type: 'highlight', codes: gCodes });

                                    gCodes.forEach(p => {
                                        const resolved = localIdMap[p] || `Từ số ${parseInt(p.replace('G', '')) + 1} (${p})`;
                                        answerHTML += `<div class="a-hl">🖍️ ${resolved}</div>`;
                                    });
                                    continue;
                                }

                                if (/^(T|C|GTID|ID)\d+/i.test(parts[0])) {
                                    const isFirstTarget = /^(C|ID)\d+/i.test(parts[0]);
                                    const tileId = isFirstTarget ? parts[1] : parts[0];
                                    const catId = isFirstTarget ? parts[0] : parts[1];

                                    const baseTileId = tileId.replace(/_\d+$/, '');
                                    const tileText = localIdMap[tileId] || localIdMap[baseTileId] || tileId;

                                    let catText = localIdMap[catId];
                                    if (!catText && /^ID\d+$/i.test(catId)) {
                                        catText = `Ô trống ${parseInt(catId.replace(/\D/g, ''), 10) + 1}`;
                                    } else if (!catText) {
                                        catText = catId;
                                    }

                                    screenActions.push({ type: 'pair', tileId, catId, tileText, catText });

                                    answerHTML += `
                                        <div class="a-pair">
                                            <div class="a-item">${tileText}</div>
                                            <div class="a-arrow">➜</div>
                                            <div class="a-item cat">${catText}</div>
                                        </div>
                                    `;
                                    continue;
                                }
                            }

                            if (!answerText) answerText = cleanAnswerString(correctId);
                            if (answerText && !displayedAnswers.has(answerText)) {
                                displayedAnswers.add(answerText);
                                answerHTML += `<div class="a-text">👉 ${answerText}</div>`;

                                if (displayedAnswers.size === 1) {
                                    screenActions.push({
                                        type: isChoice ? 'choice' : 'text',
                                        respId,
                                        rawId: correctId,
                                        value: answerText
                                    });
                                }
                            }
                        }
                    } else {
                        answerHTML = `<div style="color: #ef4444; font-size: 13px;">(Không có đáp án tự động - Bài tự luận)</div>`;
                    }

                    const badgeHTML = isMultiScreen
                        ? `<div><span class="screen-badge">SCREEN ${screenIdx + 1} / ${xmlDocs.length}</span></div>`
                        : '';

                    html += `
                        <div class="q-box" style="animation-delay: ${Math.min(globalQuestionIndex * 0.04, 0.4)}s">
                            ${badgeHTML}
                            <div class="q-text">${qText}</div>
                            <div>${answerHTML}</div>
                        </div>
                    `;
                }

                parsedScreens.push({ screenIdx, actions: screenActions });
            });

            contentDiv.innerHTML = html || '<div style="text-align:center; color:#718096; font-weight:bold;">Không tìm thấy câu hỏi nào trong XML.</div>';
            const statusEl = document.querySelector('.dg-status');
            if (statusEl) {
                statusEl.textContent = isMultiScreen ? `(${xmlDocs.length} Screens)` : '(Loaded)';
                statusEl.style.color = '#10b981';
                statusEl.style.fontWeight = 'bold';
            }

            setTimeout(runFullAutoSolve, 500);

        } catch (e) {
            contentDiv.innerHTML = `<div style="color: #ef4444; text-align:center;">Lỗi đọc: ${e.message}</div>`;
        }
    }

    function initAutoLoad() {
        let attempts = 0;
        const interval = setInterval(() => {
            attempts++;
            let found = false;
            if (window.ajaxData) found = true;
            else {
                const iframes = document.querySelectorAll('iframe');
                for (let iframe of iframes) {
                    try { if (iframe.contentWindow && iframe.contentWindow.ajaxData) { found = true; break; } } catch(e){}
                }
            }

            if (found) {
                createUI();
                setTimeout(processXML, 450);
                clearInterval(interval);
            } else if (attempts > 15) {
                removeUI();
                clearInterval(interval);
            }
        }, 800);
    }

    window.addEventListener('load', initAutoLoad);

    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            const contentDiv = document.getElementById('ollie-content');
            if (contentDiv) contentDiv.innerHTML = '<div class="loader"></div>';
            setTimeout(initAutoLoad, 800);
        }
    }).observe(document, {subtree: true, childList: true});

})();
