import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react';

export interface DrawingCanvasHandle {
  exportBlob: () => Promise<Blob | null>;
  hasDrawing: () => boolean;
  clear: () => void;
}

interface Point {
  x: number;
  y: number;
}

export const DrawingCanvas = forwardRef<DrawingCanvasHandle>(
  function DrawingCanvas(_, ref) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const drawingRef = useRef(false);
    const hasDrawingRef = useRef(false);
    const [penColor, setPenColor] = useState('#213547');
    const [penWidth, setPenWidth] = useState(6);
    const [eraser, setEraser] = useState(false);

    useEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');

      if (!canvas || !context) {
        return;
      }

      const ratio = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
      context.scale(ratio, ratio);
      context.fillStyle = '#fffdf6';
      context.fillRect(0, 0, rect.width, rect.height);
      context.lineCap = 'round';
      context.lineJoin = 'round';
    }, []);

    useImperativeHandle(ref, () => ({
      exportBlob() {
        const canvas = canvasRef.current;

        if (!canvas || !hasDrawingRef.current) {
          return Promise.resolve(null);
        }

        return new Promise((resolve) => {
          canvas.toBlob((blob) => resolve(blob), 'image/png', 0.92);
        });
      },
      hasDrawing() {
        return hasDrawingRef.current;
      },
      clear() {
        clearCanvas();
      }
    }));

    function getPoint(event: React.PointerEvent<HTMLCanvasElement>): Point {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    }

    function beginDrawing(event: React.PointerEvent<HTMLCanvasElement>) {
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');

      if (!canvas || !context) {
        return;
      }

      drawingRef.current = true;
      canvas.setPointerCapture(event.pointerId);
      const point = getPoint(event);
      context.beginPath();
      context.moveTo(point.x, point.y);
    }

    function draw(event: React.PointerEvent<HTMLCanvasElement>) {
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');

      if (!canvas || !context || !drawingRef.current) {
        return;
      }

      const point = getPoint(event);
      context.globalCompositeOperation = eraser
        ? 'destination-out'
        : 'source-over';
      context.strokeStyle = eraser ? 'rgba(0,0,0,1)' : penColor;
      context.lineWidth = eraser ? penWidth * 2 : penWidth;
      context.lineTo(point.x, point.y);
      context.stroke();
      hasDrawingRef.current = true;
    }

    function endDrawing(event: React.PointerEvent<HTMLCanvasElement>) {
      drawingRef.current = false;
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    function clearCanvas() {
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');

      if (!canvas || !context) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      context.globalCompositeOperation = 'source-over';
      context.fillStyle = '#fffdf6';
      context.fillRect(0, 0, rect.width, rect.height);
      hasDrawingRef.current = false;
    }

    return (
      <section className="media-panel" aria-labelledby="drawing-title">
        <div>
          <h2 id="drawing-title">직접 그리기</h2>
          <p>터치나 마우스로 오늘의 기억을 가볍게 그려 보세요.</p>
        </div>
        <div className="canvas-toolbar" aria-label="그림 도구">
          <label>
            색상
            <input
              type="color"
              value={penColor}
              onChange={(event) => setPenColor(event.target.value)}
              aria-label="펜 색상"
            />
          </label>
          <label>
            굵기
            <input
              type="range"
              min="2"
              max="18"
              value={penWidth}
              onChange={(event) => setPenWidth(Number(event.target.value))}
              aria-label="펜 굵기"
            />
          </label>
          <button
            className={eraser ? 'tool-button active' : 'tool-button'}
            type="button"
            onClick={() => setEraser((value) => !value)}
            aria-pressed={eraser}
          >
            지우개
          </button>
          <button className="tool-button" type="button" onClick={clearCanvas}>
            전체 지우기
          </button>
        </div>
        <canvas
          ref={canvasRef}
          className="drawing-canvas"
          aria-label="방명록 그림 그리기 캔버스"
          onPointerDown={beginDrawing}
          onPointerMove={draw}
          onPointerUp={endDrawing}
          onPointerCancel={endDrawing}
        />
      </section>
    );
  }
);
