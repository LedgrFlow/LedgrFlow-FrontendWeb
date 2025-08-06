import type { JSX } from "react";

interface SVGProps {
  xmlns?: string;
  width?: string | number;
  height?: string | number;
  fill?: string;
  viewBox?: string;
}
interface SVGComponent {
  (props: SVGProps): JSX.Element;
}

const Notification: SVGComponent = ({
  width,
  height,
  xmlns,
  fill,
  viewBox,
}) => (
  <svg
    xmlns={xmlns || "http://www.w3.org/2000/svg"}
    width={width || "24"}
    height={height || "24"}
    fill="none"
    viewBox={viewBox || "0 0 24 24"}
  >
    <g id="style=stroke">
      <g
        id="notification-bell"
        fill={fill || "#000"}
        fillRule="evenodd"
        clipRule="evenodd"
      >
        <path
          id="vector (Stroke)"
          d="M8.874 18.693a.75.75 0 0 1 .75.75q-.002.262.139.53c.095.177.243.353.447.51s.455.288.743.38.601.14.92.14.632-.048.92-.14.54-.223.744-.38.351-.333.447-.51a1.1 1.1 0 0 0 .139-.53.75.75 0 1 1 1.5 0c0 .434-.111.856-.318 1.24-.206.382-.5.716-.853.988s-.763.48-1.203.621c-.44.14-.907.211-1.376.211s-.936-.07-1.375-.21c-.44-.141-.85-.35-1.203-.622a3.1 3.1 0 0 1-.853-.988 2.6 2.6 0 0 1-.318-1.24.75.75 0 0 1 .75-.75"
        ></path>
        <path
          id="vector (Stroke)_2"
          d="M8.29 2.37a8.32 8.32 0 0 1 7.193-.104l.204.095a6.78 6.78 0 0 1 3.935 6.153v1.31c0 1.054.23 2.095.673 3.05l.265.571c1.215 2.621-.368 5.685-3.21 6.21l-.135-.737.136.738-.16.03c-3.515.649-7.12.649-10.635 0-2.88-.533-4.403-3.719-3.01-6.295l.227-.418a7.07 7.07 0 0 0 .851-3.364V8.29a6.61 6.61 0 0 1 3.666-5.92m6.564 1.258a6.82 6.82 0 0 0-5.896.085 5.11 5.11 0 0 0-2.834 4.575V9.61a8.57 8.57 0 0 1-1.032 4.078l-.226.418a2.813 2.813 0 0 0 1.963 4.105c3.335.616 6.754.616 10.09 0l.16-.03a2.923 2.923 0 0 0 2.12-4.104l-.265-.57a8.75 8.75 0 0 1-.812-3.682v-1.31a5.28 5.28 0 0 0-3.064-4.792z"
        ></path>
      </g>
    </g>
  </svg>
);

export default {
  Notification,
};
