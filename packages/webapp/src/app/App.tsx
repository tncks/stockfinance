import { Toaster } from "@/shared/ui/toaster";
import { Toaster as Sonner } from "@/shared/ui/sonner";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "../pages/Index";
import NotFound from "../pages/NotFound";

const queryClient = new QueryClient();
// further coding tip:
// option parameter manual:
/*
변수 = new QueryClient({
  defaultOptions: {
    queries: {
      // 쿼리 실패 시 재시도 횟수 설정 (기본값 3)
      retry: 2,
      // 데이터가 'stale' 간주되기 전까지 캐시된 데이터를 사용하는 시간 (기본값 0)
      // 이 시간 동안은 서버에 다시 요청하지 않고 캐시된 데이터를 사용
      staleTime: 1000 * 5, // 5초 동안 데이터가 '신선함'으로 간주되어 재요청 안 함
      // 캐시된 데이터가 메모리에 유지되는 시간 (기본값 5분)
      cacheTime: 1000 * 60 * 5, // 5분
      // 윈도우 포커스 시 자동으로 데이터 재요청 (기본값 true)
      refetchOnWindowFocus: true,
      // 컴포넌트 마운트 시 자동으로 데이터 재요청 (기본값 true)
      refetchOnMount: true,
    },
  },
});
*/

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;