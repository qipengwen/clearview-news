import './styles.css';

export const metadata = {
  title: 'Clearview｜看见正在发生的事',
  description: '多来源、可追溯的实时新闻聚合。'
};

export default function RootLayout({ children }) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
