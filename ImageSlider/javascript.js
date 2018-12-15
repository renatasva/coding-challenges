let slides = $('.slide');

slides.first().before(slides.last());

setInterval(show,4000);

function show(){
  slides = $('.slide');
  let activeSlide = $('.active');

  slides.last().after(slides.first());

  activeSlide.removeClass('active').next('.slide').addClass('active');
}
