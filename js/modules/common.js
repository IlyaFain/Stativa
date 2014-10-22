$(function()
{

	var $window = $(window);






	(function Init()
	{
		$('.g-sprites')
			.not('.current')
			.children('.sprite').not('.road, .floor, .pavement, .man')
			.addClass('g-deny-transition')
			.css("transform", "translate(2222px, 0)")
			.removeClass('g-deny-transition');

		$('.man').hide().addClass('g-rotated');


		$('#start').click(function(event)
		{
			event.preventDefault();
			$('.slide-next').click();
		});



	})();










	(function Preloader()
	{


		var loadImages = function(options)
		{
			var loadedImages = 0;
			var images = {};

			for (var i=0; i<options.URLs.length; i++)
			{
				(function()
				{
					var index = i;
					var name = options.URLs[index];

					images[name] = new Image();

					images[name].onload = function()
					{
						if (!images[name].width && !images[name].height) console.warn(name + " + has zero dimensions.");
						loadedImages++;
						options.onLoadImage(index, loadedImages, options.URLs.length);
						if (loadedImages == options.URLs.length) options.onComplete(images);
					};

					images[name].onerror = function()
					{
						console.warn(name + " cannot be loaded.");
					};

					images[name].src = name;
				})();
				
			}
		};


		var names = 
		[
			"img/pages/main/armchair.png",
			"img/pages/main/bowl.png",
			"img/pages/main/car.png",
			"img/pages/main/couch.png",
			"img/pages/main/dog.png",
			"img/pages/main/floor.jpg",
			"img/pages/main/garage-door.png",
			"img/pages/main/hang.png",
			"img/pages/main/home-door.png",
			"img/pages/main/house.png",
			"img/pages/main/ironing.png",
			"img/pages/main/lamp.png",
			"img/pages/main/letter.png",
			"img/pages/main/man.png",
			"img/pages/main/man_designer.png",
			"img/pages/main/man_dj.png",
			"img/pages/main/man_fireman.png",
			"img/pages/main/man_housekeeper.png",
			"img/pages/main/man_security.png",
			"img/pages/main/pavement.png",
			"img/pages/main/road.png",
			"img/pages/main/room.png",
			"img/pages/main/room_designer.png",
			"img/pages/main/room_dj.png",
			"img/pages/main/room_fireman.png",
			"img/pages/main/room_housekeeper.png",
			"img/pages/main/room_security.png",
			"img/pages/main/speaker.png",
			"img/pages/main/stair.png",
			"img/pages/main/table.png",
			"img/pages/main/tree.png",
			"img/pages/main/wheel.png",
		];



		loadImages(
		{
			URLs: names,

			onLoadImage: function(index, loaded, total)
			{
				console.log("loaded " + loaded + " of " + total + ", " + names[index] + " (" + index + ")");
				$('#preloader_bar').width(Math.ceil(loaded/total * 100) + "%");
			},

			onComplete: function(images)
			{
				console.log('finished!', images);
				$('.sprite').addClass('loaded');
				$('#preloader').fadeOut(200);


				$window.trigger("hashchange");


				(function StartAnimation()
				{
					if (getIndexById(document.location.hash) && getIndexById(document.location.hash) != 1)
					{
						$('.car').addClass('in');
						return;
					}

					$('.car, .front-wheel, .rear-wheel').addClass('in');

					setTimeout(function()
					{
						$('.garage-door').addClass('allow-transition in');
					}, 1200);

					setTimeout(function()
					{
						$('.home-door').addClass('allow-transition in');
					}, 1700);

					setTimeout(function()
					{
						$('.g-text.main').show().addClass('md-show');
					}, 500);

				})();


			}
		});



	})();




















	(function SwitchSlides()
	{










		// ПЕРЕХОД НА СЛЕДУЮЩИЙ СЛАЙД -------------------------------------------------------------

		var isNextButtonBlocked = false;
		$('.slide-next').on("click touchstart", function(event)
		{
			event.preventDefault();
			if (isNextButtonBlocked) return;
			// isNextButtonBlocked = true;
			// setTimeout(function(){ isNextButtonBlocked = false; }, 2000);

			var $current = $('.g-sprites.current');
			var $next = $current.prev('.g-sprites');

			document.location = "#" + $next.attr("data-name");
			return;
		});















		// ПЕРЕХОД НА ПРЕДЫДУЩИЙ СЛАЙД -------------------------------------------------------------

		var isPrevButtonBlocked = false;
		$('.slide-prev').on("click touchstart", function(event)
		{
			event.preventDefault();
			if (isPrevButtonBlocked) return;
			// isPrevButtonBlocked = true;
			// setTimeout(function(){ isPrevButtonBlocked = false; }, 2000);

			var $current = $('.g-sprites.current');
			var $prev = $current.next('.g-sprites');

			document.location = "#" + $prev.attr("data-name");
			return;
		});

















		// ПЕРЕХОД НА ПРОИЗВОЛЬНЫЙ СЛАЙД -------------------------------------------------------------

		window.goToSlide = function(index) 
		{
			if (isNextButtonBlocked || isPrevButtonBlocked) return;
			isNextButtonBlocked = isPrevButtonBlocked = true;
			setTimeout(function(){ isNextButtonBlocked = isPrevButtonBlocked = false; }, 2000);

			var $current = $('.g-sprites.current');
			var $next = $('.g-sprites').eq($('.g-sprites').length - index);

			if ($next.hasClass('current')) return;

			$('.slide-prev').toggle(!$next.hasClass('main'));
			$('.slide-next').toggle(!$next.hasClass('partners'));

			if ($next.hasClass('security')) { $next.find('.pavement').fadeIn(2000) }
			else { $current.find('.pavement').fadeOut(2000) }

			if ($next.hasClass('main')) { $next.find('.road').fadeIn(2000); $('.car, .front-wheel, .rear-wheel').removeClass('out'); }
			else { $current.find('.road').fadeOut(2000); $('.car, .front-wheel, .rear-wheel').addClass('out'); }

			$current
				.removeClass('current')
				.children('.sprite').not('.road, .floor, .pavement, .man, .car')
				.css("transform", "translate(-2222px, 0)");
			
			$next
				.addClass('current')
				.children('.sprite').not('.road, .floor, .pavement, .man, .car')
				.addClass('g-deny-transition')
				.css("transform", "translate(2222px, 0)")
				.removeClass('g-deny-transition');

			$('.floor').css("background-position", "-=1000px");

			setTimeout(function(){ $next.children('.sprite').not('.road, .floor, .pavement, .man, .car').removeAttr("style"); }, 500);

			$current.find('.man').addClass('g-rotated');
			setTimeout(function()
			{
				$current.find('.man').hide();
				$next.find('.man').show();
				setTimeout(function() { $next.find('.man').removeClass('g-rotated'); },100);
			}, 1000);

			$('.g-text')
				.removeClass('md-show')
				.filter('.' + $next.attr("data-name"))
				.addClass('md-show');

		};











	})();




	// // обработка события с отсечкой по таймауту
	// $.fn.onTimeout = function(eventType, callback, timeout)
	// {
	//     var timer = null;
	//     var start = function()
	//     {
	//         if (timer) clearTimeout(timer);
	//         timer = setTimeout(callback, timeout);
	//     }
	//     console.log($(this));
	//     return this.on(eventType, start);
	// }

	// подстройка по высоте экрана
	(function FullScreen()
	{
		if (typeof($window) == "undefined") $window = $(window);

		var minWidth = 768; // px
		var minHeight = Math.max(minWidth, $window.width())/2.5; // px;
		minHeight = Math.max(minHeight, 550);
		var $full = $('.js-fullscreen');
		$full.css({"margin":0, "padding":0});
		var onResize = (function()
		{
			$full.height($window.height() > minHeight ? $window.height() : minHeight);
			$full.width($window.width() > minHeight ? $window.width() : minWidth);
			return arguments.callee;
		})();

		$window.on("resize", onResize);
	})();







	// Перемотка между слайдами как на iPad
	(function SlideSwitcher()
	{

		$('.owl-carousel').owlCarousel({
			center: true,
			items:2,
			loop:false,
			margin:10,
			autoWidth: false,
			// responsive:{
			//     1200:{
			//         items:4
			//     }
			// }
		});

		$('.slide-switcher').css("top", "-200%");


		$('.slide-switcher-button').click(function(event)
		{
			event.preventDefault();
			$('.slide-switcher').removeAttr("style");
			var currentIndex = $('.g-sprites').length - $('.g-sprites.current').index();
			$('.owl-carousel').trigger("to.owl.carousel", [currentIndex - 1, 1]);
		});


		$('.slide-switcher').click(function()
		{
			$(this).css("top", "-200%");
		});


		$('.img-wrapper').click(function(event)
		{
			console.log(event);

			$('.slide-switcher').css("top", "-200%");

			document.location = "#" + $(this).attr("data-goto");
		});

	})();







	(function jCarousel()
	{
		$('.jcarousel-wrapper').each(function(index, element)
		{
			$wrapper = $(element);

			$ul = $('.jcarousel-list', $wrapper);
			$ul.width($ul.children('li').length * $ul.children('li').width());

			$('.jcarousel', $wrapper)
				.jcarousel(
				{
					list: '.jcarousel-list',
					wrap: null,
					animation: { duration: 500, easing: "linear" }
				})

				.on('jcarousel:create jcarousel:reload', function() {
					var element = $(this),
						width = element.parent().innerWidth();

						console.log(width)

					// This shows 1 item at a time.
					// Divide `width` to the number of items you want to display,
					// eg. `width = width / 3` to display 3 items at a time.
					element.jcarousel('items').css('width', width + 'px');
				})

				/*.on('jcarousel:visiblein', 'li', function(event, carousel)
				{
					console.log("visible", $(carousel._target).text());
				})

				.on('jcarousel:animate', function(event, carousel)
				{
					console.log("animate", $(carousel._target));
				});
				*/

			// элементы управления:
			$('.jcarousel-control-prev', $wrapper)
				.on('jcarouselcontrol:active', function() { $(this).removeClass('inactive'); })
				.on('jcarouselcontrol:inactive', function() { $(this).addClass('inactive'); })
				.jcarouselControl({ target: '-=1' });

			$('.jcarousel-control-next', $wrapper)
				.on('jcarouselcontrol:active', function() { $(this).removeClass('inactive'); })
				.on('jcarouselcontrol:inactive', function() { $(this).addClass('inactive'); })
				.jcarouselControl({ target: '+=1' });

			$('.jcarousel-pagination', $wrapper)
				.on('jcarouselpagination:active', 'a', function() {$(this).addClass('active'); })
				.on('jcarouselpagination:inactive', 'a', function() {$(this).removeClass('active'); })
				.jcarouselPagination({
					// 'item': function(page, carouselItems)
					// {
					// 	return '<span>' + page + '</span>';
					// }
				});
		});

	})();











	(function Tabs()
	{
		var $buttons = $('.tab-buttons');

		$('[data-tab]').on("click touchstart", function()
		{
			var id = $(this).attr("data-tab");

			$buttons.children('li').removeClass('current');
			$(this).addClass('current');

			$('.tab-contents').children('li').removeClass('current');
			$(id).addClass('current');

			switch(id)
			{
				case '#economy': { $buttons.removeClass('is-security is-comfort').addClass('is-economy'); break; }
				case '#security': { $buttons.removeClass('is-economy is-comfort').addClass('is-security'); break; }
				case '#comfort': { $buttons.removeClass('is-security is-economy').addClass('is-comfort'); break; }
			}

		});

	})();







	(function CallBack()
	{
		$('#callback_form').slideToggle(1);

		$('#callback_toggle').click(function()
		{
			$('#callback_form').slideToggle();
			$('#callback_toggle').toggleClass('is-open');
		})
		
	})();








	(function Photo()
	{

		$("img.lazy").Lazy(
		{
			appendScroll: $("#masonry"),

			onFinishedAll: function()
			{

			},

			afterLoad: function($element)
			{
				$('#masonry_items').masonry();
			},

		});




		$('.image-wrapper').each(function(index, element)
		{
			var $this = $(element);
			$this.css("background-image", "url(" + $this.find('img').attr("data-hover-src") +")");
		});



		$('#masonry_close_wrapper').click(function(event)
		{
			event.preventDefault();
			$('#masonry').removeClass('is-open');
			$('#masonry_close_wrapper').hide();
		});


		$('#masonry_open').click(function(event)
		{
			event.preventDefault();
			$('#masonry').addClass('is-open');
			setTimeout(function(){$('#masonry').trigger('scroll');},50);
			$('#masonry_close_wrapper').show();
			$('#masonry_items').masonry();
		});






		$('#fotorama_close_wrapper').click(function(event)
		{
			event.preventDefault();
			$('#fotorama').hide();
			$('#fotorama_close_wrapper').hide();
			$('#slide_arrows, .slide-switcher-button').show();
		});


		$('#fotorama_open').click(function(event)
		{
			event.preventDefault();
			$('#fotorama').show();
			$('#fotorama_close_wrapper').show();
			$('#slide_arrows, .slide-switcher-button').hide();
		});



	})();










	 /* Валидация */
	(function ValidateById()
	{
		var $form = $('form.js-validate');

		$form.validate(
		{
			debug: true,

			rules:
			{
				f_Phone: { required: true },
				f_Name: { required: true }
			},
			messages:
			{
				f_Phone: { required: "" },
				f_Name: { required: "" }
			},

			submitHandler: function(form)
			{
				$.ajax(
				{
					url: $form.attr("action"),
					data: $form.serialize(),
					method: "POST",
					success: function()
					{
						$form.find('input[type=submit]').remove();
						$('.form-wrapper').append('Ваша заявка отправлена.');
						$('#callback_form').delay(1000).slideToggle();

					},
					error: function()
					{
						alert("Не удалось отправить заявку, попробуйте еще раз.");
					}
				});

				return false;
			}
		});
	})();








	var getIndexById = function(id)
	{
		var slides =
		{
			'#main': 1,
			'#butler': 2,
			'#designer': 3,
			'#dj': 4,
			'#fireman': 5,
			'#security': 6,
			'#housekeeper': 7,
			'#advantages': 8,
			'#examples': 9,
			'#partners': 10
		};

		if (typeof(slides[id]) !== "undefined")
			return slides[id];
		else return false;
	};





	(function Hash()
	{

		$window.on("hashchange", function(event)
		{
			id = document.location.hash;
			console.log('hashchange', id);
			
			if (getIndexById(id))
			{
				console.log('goto', getIndexById(id));
				goToSlide(getIndexById(id));
			}
		});

	})();














})