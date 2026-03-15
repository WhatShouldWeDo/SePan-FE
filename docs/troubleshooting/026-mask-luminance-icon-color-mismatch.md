# 026. mask-luminance 아이콘이 단색 사각형으로 렌더링되는 문제

> 날짜: 2026-03-15
> 모듈: Pledges (역대공약분석)

## 증상

역대공약분석 개요 페이지의 선거 카드 아이콘이 mask-luminance 패턴으로 렌더링되지 않고, 버건디 색상의 둥근 사각형으로만 표시됨.

## 원인

Figma MCP localhost에서 다운로드한 `election-icon.png`이 mask-luminance용 흑백 에셋이 아니라 **이미 컬러가 적용된 완성 아이콘**(파란 배경 + 흰 바 차트)이었음.

1. 처음에 이 PNG를 `maskImage`로 사용 → 마스크가 정상 동작하지 않아 단색 사각형으로 보임
2. `<img>` 태그로 변경 → 아이콘 모양은 나왔지만 색상이 Figma 디자인(분홍/버건디)과 달랐음 (파란색)
3. SVG를 직접 제작 → 바 굵기/비율이 원본과 불일치

## 해결

프로젝트에 이미 존재하는 `src/assets/category-icons/aging.png`이 **동일한 아이콘**임을 발견. CategoryNav에서 mask-luminance 방식으로 정상 렌더링되고 있었음.

- `aging.png`을 import하여 재사용
- CategoryNav과 동일한 mask-luminance 패턴 적용:
  ```tsx
  style={{
    backgroundColor: "#b51d52",
    maskImage: `url('${agingIcon}')`,
    maskMode: "luminance",
    maskSize: "50px 50px",
    maskPosition: "center",
    maskRepeat: "no-repeat",
  }}
  ```

## 결과

- 아이콘이 Figma 디자인과 동일한 분홍/버건디 색상으로 정상 렌더링
- 별도 에셋 파일 불필요 (기존 에셋 재사용)

## 교훈

- Figma MCP localhost에서 다운로드하는 에셋은 원본 디자인의 렌더링된 결과물일 수 있음 (mask용 에셋이 아닐 수 있음)
- 프로젝트에 이미 같은 에셋이 존재하는지 먼저 확인할 것
- mask-luminance 방식은 흑백/luminance 기반 에셋이 필요하며, 컬러가 입혀진 이미지는 마스크로 사용할 수 없음
