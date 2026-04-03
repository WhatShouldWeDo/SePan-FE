declare module "@mapbox/polylabel" {
  /**
   * 폴리곤 내부에서 가장자리로부터 가장 먼 점(Pole of Inaccessibility)을 계산.
   * @param polygon - 외곽 링 + 홀 배열 (GeoJSON Polygon coordinates 형식)
   * @param precision - 정밀도 (기본값 1.0, 작을수록 정밀)
   * @returns [x, y] 좌표 배열 (distance 속성 포함)
   */
  function polylabel(
    polygon: number[][][],
    precision?: number,
  ): [number, number] & { distance: number };

  export default polylabel;
}
