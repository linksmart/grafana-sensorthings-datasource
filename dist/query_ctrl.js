'use strict';

System.register(['app/plugins/sdk', './css/query-editor.css!', 'app/core/core'], function (_export, _context) {
  "use strict";

  var QueryCtrl, appEvents, AlertSrv, _createClass, GenericDatasourceQueryCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_appPluginsSdk) {
      QueryCtrl = _appPluginsSdk.QueryCtrl;
    }, function (_cssQueryEditorCss) {}, function (_appCoreCore) {
      appEvents = _appCoreCore.appEvents;
      AlertSrv = _appCoreCore.AlertSrv;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('GenericDatasourceQueryCtrl', GenericDatasourceQueryCtrl = function (_QueryCtrl) {
        _inherits(GenericDatasourceQueryCtrl, _QueryCtrl);

        function GenericDatasourceQueryCtrl($scope, $injector, alertSrv) {
          _classCallCheck(this, GenericDatasourceQueryCtrl);

          var _this = _possibleConstructorReturn(this, (GenericDatasourceQueryCtrl.__proto__ || Object.getPrototypeOf(GenericDatasourceQueryCtrl)).call(this, $scope, $injector));

          _this.scope = $scope;
          _this.alertSrv = alertSrv;
          _this.notificationShowTime = 5000;

          _this.target.panelType = _this.scope.ctrl.panel.type;

          _this.queryTypes = ['Sensors', 'Things', 'Locations'];
          _this.queryThingOptions = ['Datastreams', "Historical Locations", "Historical Locations with Coordinates"];

          if (typeof _this.target.selectedLimit == "undefined") {
            _this.target.selectedLimit = 1;
          }

          // type init
          _this.target.type = _this.target.type || _this.queryTypes[0]; // rename to selectedType?

          // datastream init
          _this.target.selectedDatastreamId = _this.target.selectedDatastreamId || 0;
          _this.target.selectedDatastreamName = _this.target.selectedDatastreamName || 'select a datastream';
          _this.target.selectedDatastreamDirty = _this.target.selectedDatastreamDirty || false;
          _this.target.selectedDatastreamObservationType = _this.target.selectedDatastreamObservationType || '';
          _this.allDataSources = {};

          // sensor init
          _this.target.selectedSensorId = _this.target.selectedSensorId || 0;
          _this.target.selectedSensorName = _this.target.selectedSensorName || 'select a sensor';
          _this.target.selectedSensorDirty = _this.target.selectedSensorDirty || false;
          _this.allSensors = {};

          // thing init start
          _this.target.selectedThingId = _this.target.selectedThingId || 0;
          _this.target.selectedThingName = _this.target.selectedThingName || 'select a thing';
          _this.target.selectedThingDirty = _this.target.selectedThingDirty || false;
          _this.allThings = {};

          // location init start
          _this.target.selectedLocationId = _this.target.selectedLocationId || 0;
          _this.target.selectedLocationName = _this.target.selectedLocationName || 'select a location';
          _this.target.selectedLocationDirty = _this.target.selectedLocationDirty || false;
          _this.allLocations = {};

          // thing options init
          _this.target.selectedThingOption = _this.target.selectedThingOption || _this.queryThingOptions[0];

          _this.panelCtrl.events.on('data-received', _this.onDataReceived.bind(_this), $scope);
          _this.panelCtrl.events.on('data-error', _this.onDataError.bind(_this), $scope);

          _this.target.jsonQuery = _this.target.jsonQuery || '';
          // appEvents.emit('alert-success', ['Test notification sent', '']);

          if (_this.target.selectedThingDirty) {
            _this.alertSrv.set('Thing Not Found', _this.target.selectedThingId + ' is not a valid thing name', 'error', _this.notificationShowTime);
          }

          if (_this.target.selectedSensorDirty) {
            _this.alertSrv.set('Sensor Not Found', _this.target.selectedSensorId + ' is not a valid sensor name', 'error', _this.notificationShowTime);
          }

          if (_this.target.selectedDatastreamDirty) {
            _this.alertSrv.set('Datastream Not Found', _this.target.selectedDatastreamName + ' is not a valid datastream name', 'error', _this.notificationShowTime);
          }

          if (_this.target.selectedLocationDirty) {
            _this.alertSrv.set('Location Not Found', _this.target.selectedLocationId + ' is not a valid location name', 'error', _this.notificationShowTime);
          }
          return _this;
        }

        _createClass(GenericDatasourceQueryCtrl, [{
          key: 'buildQueryString',
          value: function buildQueryString() {
            var query = "";
            var queryparams = {};
            if (this.target.type === "Sensors") {
              query += "/Sensors";
              if (this.target.selectedSensorId !== 0) {
                query += '(' + this.target.selectedSensorId + ')';
                if (this.target.selectedDatastreamId !== 0) {
                  query = "/Datastreams";
                  query += '(' + this.target.selectedDatastreamId + ')';
                  query += "/Observations";
                  queryparams["$select"] = "phenomenonTime,result";
                  queryparams["$orderby"] = "phenomenonTime desc";
                  if (this.isOmObservationType(this.target.selectedDatastreamObservationType)) {
                    queryparams["$jsonPath"] = this.target.jsonQuery;
                  }
                }
              }
            } else if (this.target.type === "Things") {
              query += "/Things";
              if (this.target.selectedThingId !== 0) {
                query += '(' + this.target.selectedThingId + ')';
                if (this.target.selectedThingOption === "Datastreams") {
                  query += "/Datastreams";
                  if (this.target.selectedDatastreamId !== 0) {
                    query = "/Datastreams";
                    query += '(' + this.target.selectedDatastreamId + ')';
                    query += "/Observations";
                    queryparams["$select"] = "phenomenonTime,result";
                    queryparams["$orderby"] = "phenomenonTime desc";
                    if (this.isOmObservationType(this.target.selectedDatastreamObservationType)) {
                      queryparams["$jsonPath"] = this.target.jsonQuery;
                    }
                  }
                } else if (this.target.selectedThingOption === "Historical Locations") {
                  query += "/HistoricalLocations";
                  queryparams["$expand"] = "Locations($select=name)";
                  queryparams["$select"] = "time";
                  queryparams["$top"] = this.target.selectedLimit;
                } else if (this.target.selectedThingOption === "Historical Locations with Coordinates") {
                  query += "/HistoricalLocations";
                  queryparams["$expand"] = "Locations($select=name,Location)";
                  queryparams["$select"] = "time";
                  queryparams["$top"] = this.target.selectedLimit;
                  if (this.target.selectedDatastreamId !== 0) {
                    queryparams["$combine"] = encodeURIComponent("/Datastreams" + ('(' + this.target.selectedDatastreamId + ')') + "/Observations" + "?" + "$select=result,phenomenonTime" + "&" + ('$top=' + this.target.selectedLimit));
                    if (this.isOmObservationType(this.target.selectedDatastreamObservationType)) {
                      queryparams["$jsonPath"] = this.target.jsonQuery;
                    }
                  }
                }
              }
            } else if (this.target.type === "Locations") {
              query += "/Locations";
              if (this.target.selectedLocationId !== 0) {
                query += '(' + this.target.selectedLocationId + ')';
                query += "/HistoricalLocations";
                queryparams["$expand"] = "Things($select=name)";
                queryparams["$select"] = "time";
              }
            }
            queryparams['$filter'] = "$timeFilter";
            var queryparam = [];
            for (var index in queryparams) {
              queryparam.push(index + '=' + queryparams[index]);
            }
            return query + "?" + queryparam.join('&');
          }
        }, {
          key: 'onDataReceived',
          value: function onDataReceived(dataList) {
            this.lastQueryError = null;
          }
        }, {
          key: 'onDataError',
          value: function onDataError(err) {
            this.handleQueryCtrlError(err);
          }
        }, {
          key: 'handleQueryCtrlError',
          value: function handleQueryCtrlError(err) {
            if (err.query && err.query.refId && err.query.refId !== this.target.refId) {
              return;
            }

            if (err.error && err.error.data && err.error.data.error) {
              this.lastQueryError = err.error.data.error.message;
            } else if (err.error && err.error.data) {
              this.lastQueryError = err.error.data.message;
            } else if (err.data && err.data.error) {
              this.lastQueryError = err.data.error.message;
            } else if (err.data && err.data.message) {
              this.lastQueryError = err.data.message;
            } else {
              this.lastQueryError = err;
            }
          }
        }, {
          key: 'toggleEditorMode',
          value: function toggleEditorMode() {
            try {
              this.target.query = this.buildQueryString();
            } catch (err) {
              console.error('query render error');
            }
            this.target.rawQuery = !this.target.rawQuery;
          }
        }, {
          key: 'showSensors',
          value: function showSensors() {
            return this.target.type === 'Sensors';
          }
        }, {
          key: 'jsonQueryClick',
          value: function jsonQueryClick(type) {
            if (!this.isOmObservationType(type)) {
              this.alertSrv.set('Unsupported Observation Type', 'JSONPath only works when Datastream.observationType is OM_Observation', 'warning', this.notificationShowTime);
            }
          }
        }, {
          key: 'getSensors',
          value: function getSensors(query) {
            var self = this;
            return this.datasource.metricFindQuery(query || '', '/Sensors', 'sensor').then(function (result) {
              self.allSensors = result;
              return result;
            }).catch(this.handleQueryCtrlError.bind(this));
          }
        }, {
          key: 'onSensorChange',
          value: function onSensorChange(query, selectedSensorId) {
            var sensor = _.find(this.allSensors, { 'value': this.target.selectedSensorId });
            console.log('find all sensors');

            if (sensor) {
              this.target.selectedSensorName = sensor.text;
              this.target.selectedSensorDirty = false;
            } else {
              this.target.selectedSensorDirty = true;
              this.target.selectedDatastreamId = 0;
              this.alertSrv.set('Sensor Not Found', this.target.selectedSensorId + ' is not a valid sensor name', 'error', this.notificationShowTime);
            }
            this.resetDataSource();
          }
        }, {
          key: 'showThingOptions',
          value: function showThingOptions() {
            return this.target.selectedThingId !== 0 && this.target.type === 'Things';
          }
        }, {
          key: 'showThingLimit',
          value: function showThingLimit() {
            //type = Target
            //selectedThingOption = [Historical Locations|Historical Locations with Coordinates]
            return this.target.type === this.queryTypes[1] && this.target.selectedThingId !== 0 && (this.target.selectedThingOption === this.queryThingOptions[1] || this.target.selectedThingOption === this.queryThingOptions[2]);
          }
        }, {
          key: 'showDatastreams',
          value: function showDatastreams() {
            return this.target.type === 'Sensors' && this.target.selectedSensorId !== 0 || this.target.type === 'Things' && this.target.selectedThingId !== 0 && (this.target.selectedThingOption === 'Datastreams' || this.target.selectedThingOption === 'Historical Locations with Coordinates');
          }
        }, {
          key: 'getDataStreams',
          value: function getDataStreams(query) {
            var self = this;
            var targetUrl = '';
            if (this.target.selectedThingDirty || this.target.selectedSensorDirty) {
              return [{
                text: 'select a datastream',
                value: 0
              }];
            }
            if (this.target.type === 'Sensors') {
              targetUrl = '/Sensors(' + this.getFormatedId(this.target.selectedSensorId) + ')/Datastreams';
            } else {
              targetUrl = '/Things(' + this.getFormatedId(this.target.selectedThingId) + ')/Datastreams';
            }
            return this.datasource.metricFindQuery(query || '', targetUrl, 'datastream').then(function (result) {
              self.allDataSources = result;
              return result;
            }).catch(this.handleQueryCtrlError.bind(this));
          }
        }, {
          key: 'getFormatedId',
          value: function getFormatedId(id) {
            return Number.isInteger(id) || !isNaN(id) ? id : '"' + id + '"';
          }
        }, {
          key: 'onDataStreamChange',
          value: function onDataStreamChange(query) {
            if (this.target.selectedThingDirty || this.target.selectedSensorDirty) {
              return;
            }

            var datastream = _.find(this.allDataSources, { 'value': this.target.selectedDatastreamId });

            if (datastream) {
              this.target.selectedDatastreamName = datastream.text;
              this.target.selectedDatastreamObservationType = datastream.type.toLowerCase();
              this.target.selectedDatastreamDirty = false;
            } else {
              this.target.selectedDatastreamDirty = true;
              this.target.selectedDatastreamName = this.target.selectedDatastreamId;
              this.target.selectedDatastreamObservationType = '';
              this.alertSrv.set('Datastream Not Found', this.target.selectedDatastreamName + ' is not a valid datastream name', 'error', this.notificationShowTime);
            }

            if (this.isOmObservationType(this.target.selectedDatastreamObservationType)) {} else {
              this.panelCtrl.refresh();
            }
          }
        }, {
          key: 'onJsonQueryChange',
          value: function onJsonQueryChange() {
            this.panelCtrl.refresh();
          }
        }, {
          key: 'showJsonQuery',
          value: function showJsonQuery() {
            return this.target.selectedDatastreamId !== 0 && (this.target.type === 'Sensors' || this.target.type === 'Things' && (this.target.selectedThingOption === 'Datastreams' || this.target.selectedThingOption === 'Historical Locations with Coordinates')) && this.isOmObservationType(this.target.selectedDatastreamObservationType);
          }
        }, {
          key: 'isOmObservationType',
          value: function isOmObservationType(type) {
            if (_.isEmpty(type) || !type.includes('om_observation')) {
              this.target.jsonQuery = '';
              return false;
            }
            return true;
          }
        }, {
          key: 'resetDataSource',
          value: function resetDataSource() {
            this.target.selectedDatastreamId = 0;
            this.target.selectedDatastreamName = 'select a datastream';
            this.panelCtrl.refresh();
          }
        }, {
          key: 'typeChanged',
          value: function typeChanged(type) {
            this.target.selectedSensorId = 0;
            this.target.selectedThingId = 0;
            this.resetDataSource();
          }
        }, {
          key: 'showThings',
          value: function showThings() {
            return this.target.type === 'Things' || this.target.type === 'Historical Locations';
          }
        }, {
          key: 'getThings',
          value: function getThings(query) {
            var self = this;
            return this.datasource.metricFindQuery(query || '', '/Things', 'thing').then(function (result) {
              self.allThings = result;
              return result;
            }).catch(this.handleQueryCtrlError.bind(this));
          }
        }, {
          key: 'onThingChange',
          value: function onThingChange(query) {
            var thing = _.find(this.allThings, { 'value': this.target.selectedThingId });
            if (thing) {
              this.target.selectedThingName = thing.text;
              this.target.selectedThingDirty = false;
            } else {
              this.target.selectedThingDirty = true;
              this.target.selectedDatastreamId = 0;
              this.alertSrv.set('Thing Not Found', this.target.selectedThingId + ' is not a valid thing name', 'error', this.notificationShowTime);
            }
            this.resetDataSource();
          }
        }, {
          key: 'onThingsLimitChange',
          value: function onThingsLimitChange(query) {
            this.panelCtrl.refresh();
          }
        }, {
          key: 'onThingOptionChange',
          value: function onThingOptionChange(query) {
            this.panelCtrl.refresh();
          }
        }, {
          key: 'showLocations',
          value: function showLocations() {
            return this.target.type === 'Locations';
          }
        }, {
          key: 'getLocations',
          value: function getLocations(query) {
            var self = this;
            return this.datasource.metricFindQuery(query || '', '/Locations', 'location').then(function (result) {
              self.allLocations = result;
              return result;
            }).catch(this.handleQueryCtrlError.bind(this));
          }
        }, {
          key: 'onLocationChange',
          value: function onLocationChange(query) {
            // find and store the selected location name to use it as column name (refer datasource.js->transformThings())
            var location = _.find(this.allLocations, { 'value': this.target.selectedLocationId });

            if (location) {
              this.target.selectedLocationName = location.text;
              this.target.selectedLocationDirty = false;
            } else {
              this.target.selectedLocationDirty = true;
              this.alertSrv.set('Location Not Found', this.target.selectedLocationId + ' is not a valid location name', 'error', this.notificationShowTime);
            }

            this.panelCtrl.refresh();
          }
        }]);

        return GenericDatasourceQueryCtrl;
      }(QueryCtrl));

      _export('GenericDatasourceQueryCtrl', GenericDatasourceQueryCtrl);

      GenericDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';
    }
  };
});
//# sourceMappingURL=query_ctrl.js.map
