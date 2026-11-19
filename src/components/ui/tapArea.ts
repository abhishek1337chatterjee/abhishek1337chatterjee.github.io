// Touch screens only: an invisible 44 px-tall hit layer centred on the control, so small
// text links meet the tap-size minimum without changing the design. Host must be positioned.
export const TAP_44 =
  'pointer-coarse:before:absolute pointer-coarse:before:inset-x-0 pointer-coarse:before:top-1/2 pointer-coarse:before:h-11 pointer-coarse:before:-translate-y-1/2';
