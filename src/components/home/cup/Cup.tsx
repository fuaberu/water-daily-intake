import "./cup.css";

export const Cup = ({ value }: { value: number }) => {
  if (value > 1) {
    value = 1;
  } else if (value < 0) {
    value = 0;
  }
  return (
    <div
      id="banner"
      style={
        {
          "--water-level": 150 * (1 - value) + "px",
        } as React.CSSProperties
      }
      className="bg-slate-200"
    >
      <div className="fill">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          width="300px"
          height="300px"
          viewBox="0 0 300 300"
          enableBackground="new 0 0 300 300"
          xmlSpace="preserve"
        >
          <path
            fill="#04ACFF"
            id="waveShape"
            d="M300,300V2.5c0,0-0.6-0.1-1.1-0.1c0,0-25.5-2.3-40.5-2.4c-15,0-40.6,2.4-40.6,2.4
	c-12.3,1.1-30.3,1.8-31.9,1.9c-2-0.1-19.7-0.8-32-1.9c0,0-25.8-2.3-40.8-2.4c-15,0-40.8,2.4-40.8,2.4c-12.3,1.1-30.4,1.8-32,1.9
	c-2-0.1-20-0.8-32.2-1.9c0,0-3.1-0.3-8.1-0.7V300H300z"
          />
        </svg>
      </div>
    </div>
  );
};
