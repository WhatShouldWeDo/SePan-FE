import { useState, useRef, useEffect } from "react";
import type { GeoJSON } from "geojson";

interface UseConstituencyModeOptions {
  currentLevel: string;
  searchNavigation: unknown;
  choroplethData: unknown;
  featureCollection: { features: { properties?: Record<string, unknown> | null }[] } | null;
}

/**
 * 선거구 모드 상태 관리 훅
 * - isConstituencyMode: 선거구 경계/색상 표시 여부
 * - selectedConstituency: 드릴다운된 선거구 SGG 코드
 * - selectedConstituencyName: 드릴다운된 선거구명
 * - effectiveFeatureCollection: 드릴다운 시 해당 선거구 EMD만 필터링된 컬렉션
 */
export function useConstituencyMode({
  currentLevel,
  searchNavigation,
  choroplethData,
  featureCollection,
}: UseConstituencyModeOptions) {
  const [isConstituencyMode, setIsConstituencyMode] = useState(true);
  const [selectedConstituency, setSelectedConstituency] = useState<string | null>(null);
  const [selectedConstituencyName, setSelectedConstituencyName] = useState<string | null>(null);
  const selectedConstituencyRef = useRef<string | null>(null);
  selectedConstituencyRef.current = selectedConstituency;

  // 레벨 변경 시 자동 리셋 — 읍면동 이외에서는 OFF, 읍면동 진입 시 기본 ON
  useEffect(() => {
    if (currentLevel !== "eupMyeonDong") {
      setIsConstituencyMode(false);
      setSelectedConstituency(null);
      setSelectedConstituencyName(null);
    } else {
      setIsConstituencyMode(true);
    }
  }, [currentLevel]);

  // searchNavigation 변경 시 자동 리셋
  useEffect(() => {
    setSelectedConstituency(null);
    setSelectedConstituencyName(null);
  }, [searchNavigation]);

  // 히트맵 활성 시 자동 리셋
  useEffect(() => {
    if (choroplethData) {
      setIsConstituencyMode(false);
      setSelectedConstituency(null);
      setSelectedConstituencyName(null);
    }
  }, [choroplethData]);

  // 선거구 모드 OFF 시 드릴다운도 리셋
  useEffect(() => {
    if (!isConstituencyMode) {
      setSelectedConstituency(null);
      setSelectedConstituencyName(null);
    }
  }, [isConstituencyMode]);

  // 선거구 드릴다운 시: 해당 선거구의 EMD만 필터
  const effectiveFeatureCollection = featureCollection
    ? selectedConstituency && currentLevel === "eupMyeonDong"
      ? {
          type: "FeatureCollection" as const,
          features: featureCollection.features.filter(
            (f) => f.properties?.SGG_Code === selectedConstituency,
          ),
        }
      : featureCollection
    : null;

  return {
    isConstituencyMode,
    setIsConstituencyMode,
    selectedConstituency,
    setSelectedConstituency,
    selectedConstituencyName,
    setSelectedConstituencyName,
    selectedConstituencyRef,
    effectiveFeatureCollection,
  };
}
