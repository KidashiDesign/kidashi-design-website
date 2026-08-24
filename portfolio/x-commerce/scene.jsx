(function () {
  function Piece() {
    var T = window.useComposition().T;
    var ease = window.Easing.easeInOutCubic;
    var cameraScale = window.interpolate([0, 3, 6], [1, 1.16, 1], ease)(T);
    var blur = window.interpolate([0, 2.5, 3.5, 6], [16, 0, 0, 16], ease)(T);
    var opacity = window.interpolate([0, 2.5, 3.5, 6], [0.12, 1, 1, 0.12], ease)(T);
    var logoScale = window.interpolate([0, 3, 6], [0.82, 1.06, 0.82], ease)(T);

    return React.createElement(
      'div',
      { style: { position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#050505' } },
      React.createElement(
        'div',
        {
          style: {
            position: 'absolute', inset: 0,
            transform: 'scale(' + cameraScale + ')',
            transformOrigin: '50.4% 62%',
          },
        },
        React.createElement('div', {
          style: {
            position: 'absolute', inset: 0,
            backgroundImage: 'url(./assets/mockup.jpg)',
            backgroundSize: 'cover', backgroundPosition: 'center',
          },
        }),
        React.createElement('img', {
          src: './assets/logo.png',
          style: {
            position: 'absolute', left: '50.4%', top: '61%',
            width: '10.5%',
            transform: 'translate(-50%, -52%) scale(' + logoScale + ')',
            filter: 'blur(' + blur + 'px)',
            opacity: opacity,
            pointerEvents: 'none',
          },
        })
      )
    );
  }
  window.Piece = Piece;
})();
