(L.Control.Opacity = L.Control.extend({
  options: { collapsed: !1, position: "topright", label: null },
  initialize: function (t, e) {
    for (const i in (L.Util.setOptions(this, e),
    (this._layerControlInputs = []),
    (this._layers = []),
    (this._lastZIndex = 0),
    t))
      this._addLayer(t[i], i, !0);
  },
  onAdd: function (t) {
    return this._initLayout(), this._update(), this._container;
  },
  expand: function () {
    L.DomUtil.addClass(this._container, "leaflet-control-layers-expanded"),
      (this._form.style.height = null);
    var t = this._map.getSize().y - (this._container.offsetTop + 50);
    return (
      t < this._form.clientHeight
        ? (L.DomUtil.addClass(this._form, "leaflet-control-layers-scrollbar"),
          (this._form.style.height = t + "px"))
        : L.DomUtil.removeClass(this._form, "leaflet-control-layers-scrollbar"),
      this
    );
  },
  collapse: function () {
    return (
      L.DomUtil.removeClass(this._container, "leaflet-control-layers-expanded"),
      this
    );
  },
  _initLayout: function () {
    const t = "leaflet-control-layers",
      e = (this._container = L.DomUtil.create("div", t)),
      i = this.options.collapsed;
    if (
      (e.setAttribute("aria-haspopup", !0),
      L.DomEvent.disableClickPropagation(e),
      L.DomEvent.disableScrollPropagation(e),
      this.options.label)
    ) {
      const o = L.DomUtil.create("p", t + "-label");
      (o.innerHTML = this.options.label), e.appendChild(o);
    }
    var s = (this._form = L.DomUtil.create("form", t + "-list"));
    i &&
      (this._map.on("click zoom move", this.collapse, this),
      L.Browser.android ||
        L.DomEvent.on(
          e,
          { mouseenter: this.expand, mouseleave: this.collapse },
          this
        ));
    const a = (this._layersLink = L.DomUtil.create("a", t + "-toggle", e));
    (a.href = "#"),
      (a.title = "Layers"),
      L.Browser.touch
        ? (L.DomEvent.on(a, "click", L.DomEvent.stop),
          L.DomEvent.on(a, "click", this.expand, this))
        : L.DomEvent.on(a, "focus", this.expand, this),
      i || this.expand(),
      (this._baseLayersList = L.DomUtil.create("div", t + "-base", s)),
      (this._separator = L.DomUtil.create("div", t + "-separator", s)),
      (this._overlaysList = L.DomUtil.create("div", t + "-overlays", s)),
      e.appendChild(s);
  },
  _getLayer: function (e) {
    for (let t = 0; t < this._layers.length; t++)
      if (this._layers[t] && L.Util.stamp(this._layers[t].layer) === e)
        return this._layers[t];
  },
  _addLayer: function (t, e, i) {
    this._layers.push({ layer: t, name: e, overlay: i });
  },
  _update: function () {
    if (!this._container) return this;
    L.DomUtil.empty(this._baseLayersList),
      L.DomUtil.empty(this._overlaysList),
      (this._layerControlInputs = []);
    let t,
      e,
      i,
      s,
      a = 0;
    for (i = 0; i < this._layers.length; i++)
      (s = this._layers[i]),
        this._addItem(s),
        (e = e || s.overlay),
        (t = t || !s.overlay),
        (a += s.overlay ? 0 : 1);
    this.options.hideSingleBase &&
      ((t = t && 1 < a),
      (this._baseLayersList.style.display = t ? "" : "none")),
      (this._separator.style.display = e && t ? "" : "none");
  },
  _addItem: function (t) {
    const e = document.createElement("label"),
      i = document.createElement("input");
    t.overlay
      ? ((i.type = "range"),
        (i.className = "leaflet-control-layers-range"),
        (i.min = 0),
        (i.max = 100),
        (i.value = 100 * t.layer.options.opacity))
      : (i = this._createRadioElement("leaflet-base-layers", checked)),
      this._layerControlInputs.push(i),
      (i.layerId = L.Util.stamp(t.layer)),
      i.addEventListener("input", (t) => {
        t = t.target.value;
        const e = this._getLayer(i.layerId).layer;
        void 0 === e._url || e.setOpacity(Number(t / 100));
      });
    const s = document.createElement("span");
    s.innerHTML = " " + t.name;
    const a = document.createElement("div"),
      o = document.createElement("div");
    e.appendChild(a), a.appendChild(s), e.appendChild(o), o.appendChild(i);
    const l = t.overlay ? this._overlaysList : this._baseLayersList;
    l.appendChild(e);
  },
})),
  (L.control.opacity = function (t, e) {
    return new L.Control.Opacity(t, e);
  });
