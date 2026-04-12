(function ($) {
    $.widget('pic.configBodies', {
        options: {},
        _create: function () {
            var self = this, o = self.options, el = self.element;
            self._buildControls();
        },
        _buildControls: function () {
            var self = this, o = self.options, el = self.element;
            el.addClass('picConfigCategory');
            el.addClass('cfgBodies');
            $.getApiService('/config/options/bodies', null, function (opts, status, xhr) {
                console.log(opts);
                var bodies = opts.bodies;
                for (var i = 0; i < bodies.length; i++) {
                    $('<div></div>').appendTo(el).pnlBodyConfig({ bodyTypes: opts.bodyTypes, maxBodies: opts.maxBodies, capacityUnits: opts.capacityUnits })[0].dataBind(opts.bodies[i]);
                }
            });
        }
    });
    $.widget('pic.pnlBodyConfig', {
        options: {},
        _create: function () {
            var self = this, o = self.options, el = self.element;
            self._buildControls();
            el[0].dataBind = function (obj) { return self.dataBind(obj); };
        },
        _buildControls: function () {
            var self = this, o = self.options, el = self.element;
            el.empty();
            el.addClass('picConfigCategory cfgBody');
            var binding = '';
            var acc = $('<div></div>').appendTo(el).accordian({ columns: [{ text: '', style: { width: '10rem' }, binding: 'name' }, { binding: 'capacity', text: '', style: { width: '10rem', textAlign: 'right' } }] });
            var pnl = acc.find('div.picAccordian-contents');
            var line = $('<div></div>').appendTo(pnl);
            $('<input type="hidden" data-datatype="int"></input>').attr('data-bind', 'id').appendTo(line);
            $('<div></div>').appendTo(line).inputField({ labelText: 'Name', binding: binding + 'name', inputAttrs: { maxlength: 16 }, labelAttrs: { style: { marginRight: '.25rem' } } });
            $('<div></div>').appendTo(line).valueSpinner({ canEdit: true, labelText: 'Capacity', binding: binding + 'capacity', min: 0, max: 500000, step: 1000, inputAttrs: { maxlength: 7 }, labelAttrs: { style: { marginLeft: '1rem', marginRight: '.25rem' } } });
            $('<div></div>').appendTo(line).checkbox({ labelText: 'Show in Dashboard', binding: binding + 'showInDashboard' });
            line = $('<div></div>').appendTo(pnl);
            $('<div></div>').appendTo(line).checkbox({ labelText: 'Spa Manual Heat', binding: binding + 'manualHeat' }).hide();
            var btnPnl = $('<div class="picBtnPanel btn-panel"></div>').appendTo(pnl);
            var btnSave = $('<div id="btnSaveBody"></div>').appendTo(btnPnl).actionButton({ text: 'Save Body', icon: '<i class="fas fa-save"></i>' });
            btnSave.on('click', function (e) {
                var p = $(e.target).parents('div.picAccordian-contents:first');
                var v = dataBinder.fromElement(p);
                console.log(v);
                $.putApiService('/config/body', v, 'Saving ' + v.name + '...', function (data, status, xhr) {
                    console.log({ data: data, status: status, xhr: xhr });
                    self.dataBind(data);
                });
            });
        },
        dataBind: function (obj) {
            var self = this, o = self.options, el = self.element;
            var acc = el.find('div.picAccordian:first');
            var cols = acc[0].columns();
            var units = o.capacityUnits.find(elem => obj.capacityUnits === elem.val) || { val: 1, name: 'gal', desc: 'Gallons' };
            if (typeof obj.type === 'undefined') {
                if (name.toLowerCase() === 'pool') obj.type = 0;
                else if (name.toLowerCase() === 'spa') obj.type = 1;
                else obj.type = 0;
            }
            if (obj.type === 1) {
                el.find('div.picCheckbox[data-bind=manualHeat]').show();
                cols[0].elGlyph().attr('class', 'fas fa-hot-tub');
            }
            else {
                el.find('div.picCheckbox[data-bind=manualHeat]').hide();
                cols[0].elGlyph().attr('class', 'fas fa-swimming-pool');
            }
            var capacity = typeof obj.capacity !== 'undefined' ? parseInt(obj.capacity, 10) || 0 : 0;
            if (isNaN(capacity)) capacity = 0;
            cols[0].elText().text(obj.name);
            cols[1].elText().text(capacity.format('#,##0') + ' ' + units.desc);
            dataBinder.bind(el, obj);
        }
    });
    $.widget('pic.configFilters', {
        options: {},
        _create: function () {
            var self = this, o = self.options, el = self.element;
            self._buildControls();
        },
        _buildControls: function () {
            var self = this, o = self.options, el = self.element;
            el.addClass('picConfigCategory');
            el.addClass('cfgFilters');
            $.getApiService('/config/options/filters', null, `Loading Options...`, function (opts, status, xhr) {
                console.log(opts);
                var filters = opts.filters;
                for (var i = 0; i < filters.length; i++) {
                    $('<div></div>').appendTo(el).pnlFilterConfig({ filterTypes: opts.types, servers: opts.servers, bodies: opts.bodies, areaUnits: opts.areaUnits, pressureUnits: opts.pressureUnits, circuits: opts.circuits })[0].dataBind(filters[i]);
                }
            });
        }
    });
    $.widget('pic.pnlFilterConfig', {
        options: {},
        _create: function () {
            var self = this, o = self.options, el = self.element;
            self._buildControls();
            el[0].dataBind = function (obj) { return self.dataBind(obj); };
        },
        _buildControls: function () {
            var self = this, o = self.options, el = self.element;
            el.empty();
            el.addClass('picConfigCategory cfgFilter');
            var binding = '';
            var acc = $('<div></div>').appendTo(el).accordian({ columns: [{ text: '', style: { width: '10rem' }, binding: 'name', glyph: 'fas fa-recycle' }, { binding: 'type.name', text: '', style: { width: '10rem', textAlign: 'right' } }] });
            var pnl = acc.find('div.picAccordian-contents');
            var line = $('<div></div>').appendTo(pnl);
            $('<input type="hidden" data-datatype="int"></input>').attr('data-bind', 'id').appendTo(line);
            $('<div></div>').appendTo(line).inputField({ labelText: 'Name', binding: binding + 'name', inputAttrs: { maxlength: 16 }, labelAttrs: { style: { marginRight: '.25rem' } } });
            $('<div></div>').appendTo(line).pickList({
                required: true, bindColumn: 0, displayColumn: 2, labelText: 'Type', binding: binding + 'filterType',
                columns: [{ binding: 'val', hidden: true, text: 'Id', style: { whiteSpace: 'nowrap' } }, { binding: 'name', hidden: true, text: 'Code', style: { whiteSpace: 'nowrap' } }, { binding: 'desc', text: 'Media Type', style: { whiteSpace: 'nowrap' } }],
                items: o.filterTypes, inputAttrs: { style: { width: '9rem' } }, labelAttrs: { style: { marginLeft: '.25rem' } }
            });
            line = $('<div></div>').appendTo(pnl);
            $('<div></div>').appendTo(line).valueSpinner({ canEdit: true, labelText: 'Capacity', binding: binding + 'capacity', fmtMask:'#,##0.##', min: 0, max: 1000, step: 1, inputAttrs: { maxlength: 7 }, labelAttrs: { style: { marginRight: '.25rem' } } });
            $('<div></div>').appendTo(line).pickList({
                required: true, bindColumn: 0, displayColumn: 1, labelText: 'Units', binding: binding + 'capacityUnits',
                columns: [{ binding: 'val', hidden: true, text: 'Id', style: { whiteSpace: 'nowrap' } }, { binding: 'name', hidden: true, text: 'Code', style: { whiteSpace: 'nowrap' } }, { binding: 'desc', text: 'Units', style: { whiteSpace: 'nowrap' } }],
                items: o.areaUnits, inputAttrs: { style: { width: '4rem' } }, labelAttrs: { style: { display: 'none' } }
            });
            $('<hr></hr>').appendTo(pnl);
            var grpPressure = $('<fieldset></fieldset>').css({ display: 'inline-block', verticalAlign: 'top' }).appendTo(pnl);
            $('<legend></legend>').text('Filter Pressure').appendTo(grpPressure);
            line = $('<div></div>').appendTo(grpPressure);
            $('<div></div>').appendTo(line).pickList({
                required: true, bindColumn: 0, displayColumn: 1, labelText: 'Units', binding: binding + 'pressureUnits',
                columns: [{ binding: 'val', hidden: true, text: 'Id', style: { whiteSpace: 'nowrap' } }, { binding: 'name', hidden: true, text: 'Code', style: { whiteSpace: 'nowrap' } }, { binding: 'desc', text: 'Units', style: { whiteSpace: 'nowrap' } }],
                items: o.pressureUnits, inputAttrs: { style: { width: '4rem' } }, labelAttrs: { style: { width: '4rem' } }
            }).on('selchanged', function (evt) { self.setPressureUnits(evt.newItem.val); });
            $('<div></div>').appendTo(line).pickList({
                required: true, bindColumn: 0, displayColumn: 1, labelText: 'Circuit', binding: binding + 'pressureCircuitId',
                columns: [{ binding: 'id', hidden: true, text: 'Id', style: { whiteSpace: 'nowrap' } }, { binding: 'name', hidden: false, text: 'Circuit Name', style: { whiteSpace: 'nowrap' } }],
                items: o.circuits, inputAttrs: { style: { width: '5rem' } }, labelAttrs: { style: { marginLeft: '.25rem' } }
            });

            line = $('<div></div>').appendTo(grpPressure);
            $('<div></div>').appendTo(line).valueSpinner({ canEdit: true, labelText: 'Clean', binding: binding + 'cleanPressure', fmtMask: '#,##0.##', min: 0, max: 1000, step: 1, inputAttrs: { maxlength: 7 }, labelAttrs: { style: { width: '4rem' } } });
            line = $('<div></div>').appendTo(grpPressure);
            $('<div></div>').appendTo(line).valueSpinner({ canEdit: true, labelText: 'Dirty', binding: binding + 'dirtyPressure', fmtMask: '#,##0.##', min: 0, max: 1000, step: 1, inputAttrs: { maxlength: 7 }, labelAttrs: { style: { width: '4rem' } } });

            // Filter Health Monitoring Configuration
            $('<hr></hr>').appendTo(pnl);
            var grpHealth = $('<fieldset></fieldset>').css({ display: 'inline-block', verticalAlign: 'top' }).appendTo(pnl);
            $('<legend></legend>').text('Filter Health Monitoring').appendTo(grpHealth);
            line = $('<div></div>').appendTo(grpHealth);
            $('<div></div>').appendTo(line).valueSpinner({ canEdit: true, labelText: 'Max Allowable Pressure', binding: binding + 'maxAllowablePressure', fmtMask: '#,##0.##', min: 0, max: 100, step: 1, inputAttrs: { maxlength: 5 }, labelAttrs: { style: { marginRight: '.25rem' } } });
            line = $('<div></div>').appendTo(grpHealth);
            $('<div></div>').appendTo(line).valueSpinner({ canEdit: true, labelText: 'Dirty Ratio Fraction', binding: binding + 'dirtyRatioFraction', fmtMask: '#,##0.##', min: 0.1, max: 2, step: 0.05, inputAttrs: { maxlength: 5 }, labelAttrs: { style: { marginRight: '.25rem' } } });
            line = $('<div></div>').appendTo(grpHealth);
            $('<div></div>').appendTo(line).valueSpinner({ canEdit: true, labelText: 'Headroom Alarm %', binding: binding + 'headroomAlarmThreshold', fmtMask: '#,##0', min: 50, max: 100, step: 5, inputAttrs: { maxlength: 3 }, labelAttrs: { style: { marginRight: '.25rem' } } });
            line = $('<div></div>').appendTo(grpHealth);
            $('<div></div>').appendTo(line).valueSpinner({ canEdit: true, labelText: 'Min Reliable RPM', binding: binding + 'minReliableRpm', fmtMask: '#,##0', min: 0, max: 3450, step: 100, inputAttrs: { maxlength: 5 }, labelAttrs: { style: { marginRight: '.25rem' } } });
            line = $('<div></div>').appendTo(grpHealth);
            $('<div></div>').appendTo(line).checkbox({ labelText: 'Use Affinity Correction', binding: binding + 'useAffinityCorrection' });

            // Calibration profiles section
            var grpProfiles = $('<fieldset class="picFilterProfiles"></fieldset>').css({ display: 'inline-block', verticalAlign: 'top' }).appendTo(pnl);
            $('<legend></legend>').text('Calibration Profiles').appendTo(grpProfiles);
            var profileList = $('<div class="picProfileList"></div>').appendTo(grpProfiles);
            var profileBtnPnl = $('<div class="picBtnPanel btn-panel"></div>').appendTo(grpProfiles);
            var btnDiscover = $('<div></div>').appendTo(profileBtnPnl).actionButton({ text: 'Discover Profiles', icon: '<i class="fas fa-search"></i>' });
            btnDiscover.on('click', function (e) {
                var p = $(e.target).parents('div.picAccordian-contents:first');
                var v = dataBinder.fromElement(p);
                $.getApiService('/config/filter/' + v.id + '/profiles/discover', null, 'Discovering profiles...', function (data) {
                    if (data.discoveredProfiles && data.discoveredProfiles.length > 0) {
                        self._renderProfiles(profileList, data.discoveredProfiles, v.id);
                    }
                });
            });
            var btnStartCal = $('<div></div>').appendTo(profileBtnPnl).actionButton({ text: 'Start Calibration', icon: '<i class="fas fa-play"></i>' });
            btnStartCal.on('click', function (e) {
                var p = $(e.target).parents('div.picAccordian-contents:first');
                var v = dataBinder.fromElement(p);
                $.putApiService('/state/filter/' + v.id + '/calibration/start', { mode: 'manual' }, 'Starting calibration...', function (data) {
                    console.log({ calibrationStarted: data });
                });
            });

            var bindpnl = $('<div></div>').addClass('pnlDeviceBinding').REMBinding({ servers: o.servers }).appendTo(pnl).hide();
            $('<hr></hr>').prependTo(bindpnl);


            //$('<div></div>').appendTo(line).valueSpinner({ labelText: 'Capacity', binding: binding + 'capacity', min: 0, max: 500000, step: 1000, inputAttrs: { maxlength: 7 }, labelAttrs: { style: { marginLeft: '1rem', marginRight: '.25rem' } } });
            //$('<div></div>').appendTo(line).checkbox({ labelText: 'Spa Manual Heat', binding: binding + 'manualHeat' }).hide();
            var btnPnl = $('<div class="picBtnPanel btn-panel"></div>').appendTo(pnl);
            var btnSave = $('<div id="btnSaveFilter"></div>').appendTo(btnPnl).actionButton({ text: 'Save Filter', icon: '<i class="fas fa-save"></i>' });
            btnSave.on('click', function (e) {
                var p = $(e.target).parents('div.picAccordian-contents:first');
                var v = dataBinder.fromElement(p);
                if (v.cleanPressure <= v.dirtyPressure) {
                    $.putApiService('/config/filter', v, 'Saving ' + v.name + '...', function (data, status, xhr) {
                        console.log({ data: data, status: status, xhr: xhr });
                        self.dataBind(data);
                    });
                } else
                    $('<div></div>')
                        .appendTo(el.find('div[data-bind$="cleanPressure"]'))
                            .fieldTip({ message: 'The clean (starting) pressure must be less than the dirty (ending) pressure.' });


            });
        },
        setPressureUnits(val) {
            var self = this, o = self.options, el = self.element;
            var units = o.pressureUnits.find(elem => val === elem.val);
            if (typeof units !== 'undefined') {
                el.find('div[data-bind$="cleanPressure"]').each(function () { this.units(units.name); });
                el.find('div[data-bind$="dirtyPressure"]').each(function () { this.units(units.name); });
            }
        },
        _renderProfiles: function (container, profiles, filterId) {
            var self = this;
            container.empty();
            if (!profiles || profiles.length === 0) {
                $('<div class="picNoProfiles"></div>').text('No calibration profiles configured.').appendTo(container);
                return;
            }
            var tbl = $('<table class="picProfileTable"><thead><tr><th>Name</th><th>Circuits</th><th>Data Points</th><th>Active</th><th></th></tr></thead></table>').appendTo(container);
            var tbody = $('<tbody></tbody>').appendTo(tbl);
            for (var i = 0; i < profiles.length; i++) {
                var p = profiles[i];
                var tr = $('<tr></tr>').appendTo(tbody);
                $('<td></td>').text(p.name || '').appendTo(tr);
                $('<td></td>').text(Array.isArray(p.circuitIds) ? p.circuitIds.join(', ') : '').appendTo(tr);
                $('<td></td>').text(Array.isArray(p.dataPoints) ? p.dataPoints.length : 0).appendTo(tr);
                $('<td></td>').text(p.isActive ? 'Yes' : 'No').appendTo(tr);
                var tdActions = $('<td></td>').appendTo(tr);
                (function (profile) {
                    var btnDel = $('<button class="picBtnSmall" title="Remove profile"><i class="fas fa-trash"></i></button>').appendTo(tdActions);
                    btnDel.on('click', function () {
                        $.ajax({
                            url: '/njsPC/config/filter/' + filterId + '/profile',
                            type: 'DELETE',
                            contentType: 'application/json',
                            data: JSON.stringify({ profileId: profile.id }),
                            success: function (data) {
                                if (data.profiles) self._renderProfiles(container, data.profiles, filterId);
                            }
                        });
                    });
                })(p);
            }
        },
        dataBind: function (obj) {
            var self = this, o = self.options, el = self.element;
            var acc = el.find('div.picAccordian:first');
            var cols = acc[0].columns();
            cols[0].elText().text(obj.name);
            var type = o.filterTypes.find(elem => elem.val === obj.filterType);
            cols[1].elText().text(typeof type === 'object' ? type.desc || 'Unknown' : 'Unknown');
            if (obj.master === 1) el.find('div.pnlDeviceBinding').show();
            else el.find('div.pnlDeviceBinding').hide();
            self.setPressureUnits(obj.pressureUnits);
            // Render calibration profiles if present.
            if (Array.isArray(obj.profiles)) {
                self._renderProfiles(el.find('.picProfileList'), obj.profiles, obj.id);
            }
            dataBinder.bind(el, obj);
        }
    });
})(jQuery); 
