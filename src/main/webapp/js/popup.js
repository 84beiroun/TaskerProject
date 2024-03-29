class GraphModal {
    constructor(t) {
        this.options = Object.assign({
            isOpen: () => {},
            isClose: () => {}
        }, t), this.modal = document.querySelector(".modal"), this.speed = 300, this.animation = "fade", this._reOpen = !1, this._nextContainer = !1, this.modalContainer = !1, this.isOpen = !1, this.previousActiveElement = !1, this._focusElements = ["a[href]", "input", "select", "textarea", "button", "iframe", "[contenteditable]", '[tabindex]:not([tabindex^="-"])'], this._fixBlocks = document.querySelectorAll(".fix-block"), this.events()
    }
    events() {
        this.modal && (document.addEventListener("click", function(t) {
            const e = t.target.closest("[data-graph-path]");
            if (e) {
                let t = e.dataset.graphPath,
                    s = e.dataset.graphAnimation,
                    i;
                if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) i = 100;
                else i = e.dataset.graphSpeed;
                return this.animation = s || "fade", this.speed = i ? parseInt(i) : 300, this._nextContainer = document.querySelector(`[data-graph-target="${t}"]`), void this.open()
            }
            t.target.closest(".modal__close") && this.close()
        }.bind(this)), window.addEventListener("keydown", function(t) {
            27 == t.keyCode && this.isOpen && this.close(), 9 == t.which && this.isOpen && this.focusCatch(t)
        }.bind(this)), this.modal.addEventListener("click", function(t) {
            t.target.classList.contains("modal__container") || t.target.closest(".modal__container") || !this.isOpen || this.close()
        }.bind(this)))
    }
    open(t) {
        if (this.previousActiveElement = document.activeElement, this.isOpen) return this.reOpen = !0, void this.close();
        this.modalContainer = this._nextContainer, t && (this.modalContainer = document.querySelector(`[data-graph-target="${t}"]`)), this.modal.style.setProperty("--transition-time", `0.3s`), this.modal.classList.add("is-open"), this.disableScroll(), this.modalContainer.classList.add("modal-open"), this.modalContainer.classList.add(this.animation), setTimeout(() => {
            this.options.isOpen(this), this.modalContainer.classList.add("animate-open"), this.isOpen = !0, this.focusTrap()
        }, this.speed)
    }
    close() {
        this.modalContainer && (this.modalContainer.classList.remove("animate-open"), this.modalContainer.classList.remove(this.animation), setTimeout(() => {
            this.modal.classList.remove("is-open"), this.modalContainer.classList.remove("modal-open"), this.enableScroll()
        }, 500), this.options.isClose(this), this.isOpen = !1, this.focusTrap(), this.reOpen && (this.reOpen = !1, this.open()))
    }
    focusCatch(t) {
        const e = this.modalContainer.querySelectorAll(this._focusElements),
            s = Array.prototype.slice.call(e),
            i = s.indexOf(document.activeElement);
        t.shiftKey && 0 === i && (s[s.length - 1].focus(), t.preventDefault()), t.shiftKey || i !== s.length - 1 || (s[0].focus(), t.preventDefault())
    }
    focusTrap() {
        const t = this.modalContainer.querySelectorAll(this._focusElements);
        this.isOpen ? t.length && t[0].focus() : this.previousActiveElement.focus()
    }
    disableScroll() {
        let t = window.scrollY;
        this.lockPadding(), document.body.classList.add("disable-scroll"), document.body.dataset.position = t, document.body.style.top = -t + "px"
    }
    enableScroll() {
        let t = parseInt(document.body.dataset.position, 10);
        this.unlockPadding(), document.body.style.top = "auto", document.body.classList.remove("disable-scroll"), window.scroll({
            top: t,
            left: 0
        }), document.body.removeAttribute("data-position")
    }
    lockPadding() {
        let t = window.innerWidth - document.body.offsetWidth + "px";
        this._fixBlocks.forEach(e => {
            e.style.paddingRight = t
        }), document.body.style.paddingRight = t
    }
    unlockPadding() {
        this._fixBlocks.forEach(t => {
            t.style.paddingRight = "0px"
        }), document.body.style.paddingRight = "0px"
    }
}