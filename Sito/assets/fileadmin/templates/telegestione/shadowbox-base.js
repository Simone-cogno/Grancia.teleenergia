var Shadowbox = {};
Shadowbox.lib = function(){
    var F = {};
    var C = /(-[a-z])/gi;
    var B = function(H, I){
        return I.charAt(1).toUpperCase()
    };
    var G = function(I){
        var H;
        if (!(H = F[I])) {
            H = F[I] = I.replace(C, B)
        }
        return H
    };
    var A = document.defaultView;
    var E = /alpha\([^\)]*\)/gi;
    var D = function(J, H){
        var I = J.style;
        if (window.ActiveXObject) {
            I.zoom = 1;
            I.filter = (I.filter || "").replace(E, "") + (H == 1 ? "" : " alpha(opacity=" + (H * 100) + ")")
        }
        else {
            I.opacity = H
        }
    };
    return {
        adapter: "standalone",
        getStyle: function(){
            return A && A.getComputedStyle ? function(L, K){
                var H, J, I;
                if (K == "float") {
                    K = "cssFloat"
                }
                if (H = L.style[K]) {
                    return H
                }
                if (J = A.getComputedStyle(L, "")) {
                    return J[G(K)]
                }
                return null
            }
 : function(M, L){
                var I, K, J;
                if (L == "opacity") {
                    if (typeof M.style.filter == "string") {
                        var H = M.style.filter.match(/alpha\(opacity=(.+)\)/i);
                        if (H) {
                            var N = parseFloat(H[1]);
                            if (!isNaN(N)) {
                                return (N ? N / 100 : 0)
                            }
                        }
                    }
                    return 1
                }
                else {
                    if (L == "float") {
                        L = "styleFloat"
                    }
                }
                var J = G(L);
                if (I = M.style[J]) {
                    return I
                }
                if (K = M.currentStyle) {
                    return K[J]
                }
                return null
            }
        }(),
        setStyle: function(K, J, L){
            if (typeof J == "string") {
                var H = G(J);
                if (H == "opacity") {
                    D(K, L)
                }
                else {
                    K.style[H] = L
                }
            }
            else {
                for (var I in J) {
                    this.setStyle(K, I, J[I])
                }
            }
        },
        get: function(H){
            return typeof H == "string" ? document.getElementById(H) : H
        },
        remove: function(H){
            H.parentNode.removeChild(H)
        },
        getTarget: function(I){
            var H = I.target ? I.target : I.srcElement;
            return H.nodeType == 3 ? H.parentNode : H
        },
        getPageXY: function(I){
            var H = I.pageX || (I.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
            var J = I.pageY || (I.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
            return [H, J]
        },
        preventDefault: function(H){
            if (H.preventDefault) {
                H.preventDefault()
            }
            else {
                H.returnValue = false
            }
        },
        keyCode: function(H){
            return H.which ? H.which : H.keyCode
        },
        addEvent: function(J, H, I){
            if (J.addEventListener) {
                J.addEventListener(H, I, false)
            }
            else {
                if (J.attachEvent) {
                    J.attachEvent("on" + H, I)
                }
            }
        },
        removeEvent: function(J, H, I){
            if (J.removeEventListener) {
                J.removeEventListener(H, I, false)
            }
            else {
                if (J.detachEvent) {
                    J.detachEvent("on" + H, I)
                }
            }
        },
        append: function(J, I){
            if (J.insertAdjacentHTML) {
                J.insertAdjacentHTML("BeforeEnd", I)
            }
            else {
                if (J.lastChild) {
                    var H = J.ownerDocument.createRange();
                    H.setStartAfter(J.lastChild);
                    var K = H.createContextualFragment(I);
                    J.appendChild(K)
                }
                else {
                    J.innerHTML = I
                }
            }
        }
    }
}();
