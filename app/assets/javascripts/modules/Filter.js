(function (Module) {

var FILTER_TYPES = [
  ["Low pass"   , BiquadFilterNode.LOWPASS  ],
  ["High pass"  , BiquadFilterNode.HIGHPASS ],
  ["Band pass"  , BiquadFilterNode.BANDPASS ],
  ["Low shelf"  , BiquadFilterNode.LOWSHELF ],
  ["High shelf" , BiquadFilterNode.HIGHSHELF],
  ["Peaking"    , BiquadFilterNode.PEAKING  ],
  ["Notch"      , BiquadFilterNode.NOTCH    ],
  ["All pass"   , BiquadFilterNode.ALLPASS  ]
];

var FILTER_TYPES_NAME   = _.pluck( FILTER_TYPES, 0);
var FILTER_TYPE_VALUES = _.pluck( FILTER_TYPES, 1);

zound.modules.Filter = Module.extend({
  defaults: _.extend({}, Module.prototype.defaults, {
    title: "Filter",
    color: "#358"
  }),
  initialize: function () {
    Module.prototype.initialize.call(this);
    this.pType      = new zound.models.ModulePropertySelect({ values: FILTER_TYPES_NAME, title: "Type" });
    this.pFrequency = new zound.models.ModulePropertyRange({ min: 10, max: 22050, title: "Frequency", value: 22050 });
    this.pQ         = new zound.models.ModulePropertyRange({
      max   : 1000,
      min   : 0.00009999999747378752,
      value : 1,
      title : "Q" 
    });
    this.pGain      = new zound.models.ModulePropertyRange({
      max   : 40,
      min   : -40,
      title : "gain",
      value : 0
    });
    // FIXME: a lot of things to add here :)
    this.properties.add([this.pFrequency, this.pType, this.pQ, this.pGain]);

  },
  init: function (ctx) {
    this.filter = ctx.createBiquadFilter();
    this.updateFrequency();
    this.pFrequency.on("change", _.bind(this.updateFrequency, this));
    this.pType.on("change", _.bind(this.updateFilter, this));
    this.pQ.on("change", _.bind(this.updateQ, this));
    this.pGain.on("change", _.bind(this.updateGain, this));
  },
  updateFrequency: function () {
    this.filter.frequency.value = this.pFrequency.get("value");
  },
  updateFilter : function(){
    this.filter.type = FILTER_TYPE_VALUES[this.pType.get("value")];
  },
  updateQ: function(){
    this.filter.Q.value = this.pQ.get("value");
  },
  updateGain : function(){
    this.filter.gain.value = this.pGain.get("value");
  },
  playThrough: function (nodeInput, ctx) {
    nodeInput.connect(this.filter);
    this.broadcastToOutputs(this.filter, ctx);
  }
}, { moduleName: "Output" });

}(zound.models.Module));


