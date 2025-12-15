import { Loader2, X } from 'lucide-react';
import React, { useState } from 'react';
import CharacterCreation from './components/CharacterCreation';
import IntroScreen from './components/IntroScreen';
import { AppState, CharacterData } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INTRO);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleStartGame = async (data: CharacterData) => {
    // 验证必填字段
    if (!data.name || data.name.trim() === '') {
      toastr.warning('请填写角色姓名', '信息不完整');
      return;
    }

    console.info("Character Data:", data);
    setAppState(AppState.GENERATING);

    try {
      // 格式化角色信息
      const genderText = data.gender === 'male' ? '男' : data.gender === 'female' ? '女' : '其他';
      const raceText = data.subRace ? `${data.race}（${data.subRace}）` : data.race;

      const infoParts: string[] = [
        `【角色信息】`,
        `姓名：${data.name}`,
        `年龄：${data.age}`,
        `性别：${genderText}`,
        `种族：${raceText}`,
      ];

      if (data.personality) {
        infoParts.push(`性格：${data.personality}`);
      }

      infoParts.push('', `【属性】`);
      infoParts.push(
        `力量：${data.stats.strength}`,
        `敏捷：${data.stats.agility}`,
        `智力：${data.stats.intelligence}`,
        `体质：${data.stats.constitution}`,
        `精神：${data.stats.spirit}`
      );

      if (data.description) {
        infoParts.push('', `【外貌与补充说明】`, data.description);
      }

      if (data.scenario) {
        infoParts.push('', `【自定义开局剧情】`, data.scenario);
      }

      const characterInfo = infoParts.join('\n');

      // 创建用户消息并发送角色信息
      await createChatMessages([
        {
          role: 'user',
          message: characterInfo,
          name: data.name,
        }
      ]);

      // 触发 AI 回复
      await triggerSlash('/trigger');

      // 显示成功提示
      toastr.success('角色信息已发送，故事即将开始...', '命运的齿轮开始转动');

      // 发送成功后保持 GENERATING 状态，让用户看到加载动画
      // AI 开始回复后，界面会自然过渡到聊天界面
    } catch (error) {
      console.error('发送角色信息失败:', error);
      toastr.error('发送角色信息失败，请重试', '错误');
      setAppState(AppState.CREATION); // 出错时返回创建界面
    }
  };

  const closeModal = () => setActiveModal(null);

  // Modal Render Logic
  const renderModal = () => {
    if (!activeModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal}></div>

        {/* Content */}
        <div className="relative w-full max-w-lg animate-fade-in-up">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-700 to-purple-600 rounded-lg blur opacity-50"></div>
            <div className="relative bg-stone-900 border border-stone-700 rounded-lg p-8 shadow-2xl">
                <button onClick={closeModal} className="absolute top-4 right-4 text-stone-500 hover:text-stone-300">
                    <X />
                </button>

                <h3 className="text-2xl font-cinzel text-amber-500 mb-4 border-b border-stone-800 pb-2">
                    系统详情
                </h3>
                <div className="text-stone-300 space-y-4 font-serif min-h-[200px] flex items-center justify-center border-2 border-dashed border-stone-800 rounded bg-stone-950/50">
                    <p className="text-center italic text-stone-500">
                        [此处为 {activeModal} 的详细说明界面] <br/>
                        <span className="text-sm">等待 LLM 知识库接入...</span>
                    </p>
                </div>
            </div>
        </div>
      </div>
    );
  };

  const renderLoadingScreen = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-950 text-amber-500 z-50">
        <Loader2 className="w-16 h-16 animate-spin mb-8" />
        <h2 className="text-2xl font-cinzel tracking-widest animate-pulse">Weaving Fate...</h2>
        <p className="text-stone-500 mt-4 text-sm font-serif">正在根据您的设定生成世界线...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 selection:bg-amber-900 selection:text-white">
      {appState === AppState.INTRO && (
        <IntroScreen onComplete={() => setAppState(AppState.CREATION)} />
      )}

      {appState === AppState.CREATION && (
        <CharacterCreation
            onStartGame={handleStartGame}
            onRequestModal={(type) => setActiveModal(type)}
        />
      )}

      {appState === AppState.GENERATING && renderLoadingScreen()}

      {renderModal()}
    </div>
  );
};

export default App;
