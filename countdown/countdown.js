/**
 * jCountdown
 *
 * JS
 *
 * @url https://codepen.io/wolf-w/pen/QNGXom/
 * @author Wolf Wortmann <http://elementcode.de> / <wolf@wolfgang-m.de>
 * @copyright (c) Copyright 2016 Wolf Wortmann <http://elementcode.de> / <wolf@wolfgang-m.de>
 * @license Feel free to use, modify and redistribute this code. But keep this license AND copyright notice.
 */
;(function($) {
	var jCountdown = {
		countdowns: [],

		init: function(){
			$('[data-countdown]').each(function(){
				var $this = $(this),
						data = {
							self: $this,
							target: $this.data('countdown')
						};
				$.extend(data, jCountdown.getUnits($this));
				data.biggestUnit = jCountdown.getBiggestUnit(data.unitNames);

				jCountdown.countdowns.push(data);
			});
			jCountdown.startCountdowns();
		},

		getUnits: function($countdown){
			var unitNames = [],
					unitFields = {};
			$('[data-countdown-unit]', $countdown).each(function(){
				var $this = $(this),
						name = $this.data('countdown-unit');
				unitNames.push(name);
				unitFields[name] = $this;
			})

			return {'unitNames': unitNames, 'unitFields': unitFields};
		},
		getBiggestUnit: function(units){
			var lookup = {//use steps of 10 for later sub units
						seconds: 10,
						minutes: 20,
						hours: 30,
						days: 40,
						weeks: 50,
						months: 60,
						years: 70
					},
					list = [];
			units.forEach(function(unit){
				list.push(lookup[unit]);
			});

			return Math.max.apply(null, list);
		},

		startCountdowns: function(){
			jCountdown.countdowns.forEach(function(countdown, key){
				if(jCountdown.updateCountdown(countdown)){
					jCountdown.countdowns[key].interval = setInterval(function(){
						if(!jCountdown.updateCountdown(countdown)){
							clearInterval(countdown.interval);
						}
					}, 1000);
				}
			})
		},
		updateCountdown: function(countdown){
			var remaining = jCountdown.timeRemaining(countdown);
			if(remaining.total > 0){
				countdown.unitNames.forEach(function(name){
					countdown.unitFields[name].text(remaining[name]);
				})

				return true;
			}
			else{
				return false;
			}
		},
		timeRemaining: function(countdown){
			var difference = Date.parse(countdown.target) - Date.parse(new Date()),
					data = {
						total: difference
					};

			if(countdown.unitNames.indexOf('seconds')+1){
				data.seconds = Math.floor(difference / 1000);
				if(countdown.biggestUnit > 10){data.seconds = Math.floor(data.seconds % 60)}
			}
			if(countdown.unitNames.indexOf('minutes')+1){
				data.minutes = Math.floor(difference / 1000 / 60);
				if(countdown.biggestUnit > 20){data.minutes = Math.floor(data.minutes % 60)}
			}
			if(countdown.unitNames.indexOf('hours')+1){
				data.hours = Math.floor(difference / (1000 * 60 * 60));
				if(countdown.biggestUnit > 30){data.hours = Math.floor(data.hours % 24)}
			}
			if(countdown.unitNames.indexOf('days')+1){
				data.days = Math.floor(difference / (1000 * 60 * 60 * 24));
				if(countdown.biggestUnit > 40){data.days = Math.floor(data.days % 7)}
			}
			if(countdown.unitNames.indexOf('weeks')+1){
				data.weeks = Math.floor(difference / (1000 * 60 * 60 * 24 * 7));
				if(countdown.biggestUnit > 50){data.weeks = Math.floor(data.weeks % 4.35)}
			}
			if(countdown.unitNames.indexOf('months')+1){
				data.months = Math.floor(difference / (1000 * 60 * 60 * 24 * 7 * 4.35));
				if(countdown.biggestUnit > 60){data.months = Math.floor(data.months % 12)}
			}
			if(countdown.unitNames.indexOf('years')+1){
				data.years = Math.floor(difference / (1000 * 60 * 60 * 24 * 7 * 4.35 * 12));
			}

			return data;
		}
	}

	$(document).ready(jCountdown.init);
})(jQuery);
