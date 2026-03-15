# 024. SVG 폴리곤 hover stroke가 인접 폴리곤에 가려지는 문제

> 작성일: 2026-03-15

---

## 증상

지도에서 지역 hover 시 stroke를 3px로 표시하면, 인접 지역과 맞닿는 경계선의 stroke가 절반만 보이거나 완전히 가려짐.

## 원인

SVG는 CSS `z-index`가 아닌 **DOM 순서**로 렌더링 우선순위를 결정한다. `regionData.map()`으로 순차 렌더링하면 hover된 폴리곤 이후에 렌더링되는 인접 폴리곤이 stroke 위에 덮어씌워짐.

예: 폴리곤 A(hover) → 폴리곤 B(인접) 순서로 렌더링되면, B의 fill이 A의 stroke를 가림.

## 해결

`KoreaAdminMap.tsx`에서 `regionData.map()`을 두 번 순회하도록 변경:

1. **1차 패스**: hover/selected가 아닌 폴리곤만 렌더링 (일반 레이어)
2. **2차 패스**: hover/selected 폴리곤만 렌더링 (최상위 레이어)

```tsx
<g ref={gRef}>
  {/* 기본 폴리곤 */}
  {regionData.map(({ region, ... }) => {
    if (hoveredCode === region.code || selectedCode === region.code) return null;
    return <RegionPolygon isHovered={false} isSelected={false} ... />;
  })}
  {/* hover/selected 폴리곤을 마지막에 렌더링 */}
  {regionData.map(({ region, ... }) => {
    const isHovered = hoveredCode === region.code;
    const isSelected = selectedCode === region.code;
    if (!isHovered && !isSelected) return null;
    return <RegionPolygon isHovered={isHovered} isSelected={isSelected} ... />;
  })}
</g>
```

## 결과

hover된 폴리곤의 3px stroke가 항상 인접 폴리곤 위에 표시됨. 두 번 순회하지만 `return null`로 스킵하는 항목은 렌더링 비용이 없어 성능 영향 미미.
