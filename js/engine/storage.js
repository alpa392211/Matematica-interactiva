/* ==========================================================================
   MATEMÁTICA INTERACTIVA - Sistema de Progreso y Almacenamiento Local
   Archivo: js/engine/storage.js
   ========================================================================== */

window.MatInteractiva = window.MatInteractiva || {};

(function (ns) {
  'use strict';

  const STORAGE_KEY = 'matematica_interactiva_progreso_v1';

  function getDefaultState() {
    const today = new Date().toISOString().slice(0, 10);
    return {
      xp: 0,
      streakDays: 1,
      lastActiveDate: today,
      lastVisited: {
        subjectId: 'limites',
        topicId: 'lim-1',
        tab: 'teoria'
      },
      solvedExercises: {},     // { [exerciseId]: { solvedAt, attempts, hintsUsed, level, subjectId, topicId } }
      exerciseAttempts: {},    // { [exerciseId]: { attempts: 0, hintsRevealed: 0 } }
      studiedTopics: {},       // { [topicId]: true }
      quizScores: {},          // { [topicId]: { score, total, percentage, completedAt } }
      recentActivity: [],      // [{ title, type, xp, date }]
      calcHistory: []          // [{ expr, result }]
    };
  }

  let state = loadState();

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return getDefaultState();
      const parsed = JSON.parse(raw);
      const merged = Object.assign(getDefaultState(), parsed);
      updateStreak(merged);
      return merged;
    } catch (e) {
      return getDefaultState();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // Ignorar si el navegador bloquea localStorage en modo privado estricto
    }
  }

  function updateStreak(st) {
    const today = new Date().toISOString().slice(0, 10);
    if (st.lastActiveDate === today) return;

    const last = new Date(st.lastActiveDate + 'T00:00:00');
    const now = new Date(today + 'T00:00:00');
    const diffDays = Math.round((now - last) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      st.streakDays = (st.streakDays || 1) + 1;
    } else if (diffDays > 1) {
      st.streakDays = 1;
    }
    st.lastActiveDate = today;
  }

  function addActivity(title, type, xpGained = 0) {
    state.recentActivity.unshift({
      title,
      type,
      xp: xpGained,
      date: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    });
    if (state.recentActivity.length > 20) {
      state.recentActivity.length = 20;
    }
  }

  function markTopicStudied(subjectId, topicId, topicTitle) {
    state.lastVisited = { subjectId, topicId, tab: 'teoria' };
    if (!state.studiedTopics[topicId]) {
      state.studiedTopics[topicId] = true;
      state.xp += 15;
      addActivity(`Tema estudiado: ${topicTitle}`, 'theory', 15);
    }
    saveState();
  }

  function getExerciseAttemptState(exerciseId) {
    if (!state.exerciseAttempts[exerciseId]) {
      state.exerciseAttempts[exerciseId] = { attempts: 0, hintsRevealed: 0 };
    }
    return state.exerciseAttempts[exerciseId];
  }

  function recordHintUsed(exerciseId, maxHints) {
    const att = getExerciseAttemptState(exerciseId);
    if (att.hintsRevealed < maxHints) {
      att.hintsRevealed += 1;
      saveState();
    }
    return att.hintsRevealed;
  }

  function recordFailedAttempt(exerciseId) {
    const att = getExerciseAttemptState(exerciseId);
    att.attempts += 1;
    saveState();
    return att.attempts;
  }

  function recordExerciseSolved(exerciseId, meta) {
    const att = getExerciseAttemptState(exerciseId);
    att.attempts += 1;

    const alreadySolved = Boolean(state.solvedExercises[exerciseId]);
    let xpEarned = 0;

    if (!alreadySolved) {
      const baseXP = meta.level === 'avanzado' ? 40 : meta.level === 'intermedio' ? 25 : 15;
      const hintPenalty = Math.min(baseXP - 5, att.hintsRevealed * 3);
      xpEarned = Math.max(5, baseXP - hintPenalty);
      state.xp += xpEarned;

      state.solvedExercises[exerciseId] = {
        solvedAt: new Date().toISOString(),
        attempts: att.attempts,
        hintsUsed: att.hintsRevealed,
        level: meta.level,
        subjectId: meta.subjectId,
        topicId: meta.topicId
      };

      addActivity(`Ejercicio resuelto (${meta.level}): ${meta.topicTitle}`, 'exercise', xpEarned);
    }

    saveState();
    return { alreadySolved, xpEarned, attempts: att.attempts, hintsUsed: att.hintsRevealed };
  }

  function recordQuizCompleted(topicId, topicTitle, score, total) {
    const percentage = Math.round((score / total) * 100);
    const prev = state.quizScores[topicId];
    let xpEarned = 0;

    if (!prev || percentage > prev.percentage) {
      xpEarned = score * 20;
      state.xp += xpEarned;
      state.quizScores[topicId] = {
        score,
        total,
        percentage,
        completedAt: new Date().toISOString()
      };
      addActivity(`Evaluación superada (${percentage}%): ${topicTitle}`, 'quiz', xpEarned);
      saveState();
    }
    return { percentage, xpEarned };
  }

  function getStudentRank(xp) {
    if (xp >= 800) return { title: 'Arquitecto de Gauss', badge: '👑' };
    if (xp >= 450) return { title: 'Maestro Newtoniano', badge: '🚀' };
    if (xp >= 220) return { title: 'Analista Cartesiano', badge: '📐' };
    if (xp >= 80)  return { title: 'Explorador Euclidiano', badge: '🧭' };
    return { title: 'Aprendiz Pitagórico', badge: '🌱' };
  }

  /**
   * Calcula estadísticas globales y por materia cruzando con el currículo
   */
  function computeProgressStats(curriculum) {
    let totalExercises = 0;
    let totalSolved = 0;
    let totalTopics = 0;
    let studiedTopicsCount = 0;
    let totalQuizzesDone = 0;
    const bySubject = {};
    const byLevel = { basico: 0, intermedio: 0, avanzado: 0 };
    const pendingTopics = [];
    const quizResultsList = [];

    for (const subj of curriculum) {
      let subjExTotal = 0;
      let subjExSolved = 0;
      let subjQuizzes = 0;
      let subjTopicsStudied = 0;

      for (const topic of subj.topics) {
        totalTopics++;
        const isStudied = Boolean(state.studiedTopics[topic.id]);
        if (isStudied) {
          studiedTopicsCount++;
          subjTopicsStudied++;
        }

        const qScore = state.quizScores[topic.id];
        if (qScore) {
          totalQuizzesDone++;
          subjQuizzes++;
          quizResultsList.push({
            subjectId: subj.id,
            subjectName: subj.name,
            topicId: topic.id,
            topicTitle: topic.title,
            score: qScore.score,
            total: qScore.total,
            percentage: qScore.percentage
          });
        }

        let topicSolvedCount = 0;
        for (const ex of topic.exercises) {
          totalExercises++;
          subjExTotal++;
          if (state.solvedExercises[ex.id]) {
            totalSolved++;
            subjExSolved++;
            topicSolvedCount++;
            if (byLevel[ex.level] !== undefined) byLevel[ex.level]++;
          }
        }

        // Un tema se considera pendiente si aún no tiene todos sus ejercicios resueltos o evaluación completada
        if (topicSolvedCount < topic.exercises.length || !qScore) {
          pendingTopics.push({
            subjectId: subj.id,
            subjectName: subj.name,
            topicId: topic.id,
            topicTitle: topic.title,
            studied: isStudied,
            exDone: topicSolvedCount,
            exTotal: topic.exercises.length,
            quizDone: Boolean(qScore)
          });
        }
      }

      const topicsLen = Array.isArray(subj.topics) ? subj.topics.length : 0;
      const subjTotalItems = subjExTotal + topicsLen * 2;
      const subjDoneItems = subjExSolved + subjQuizzes + subjTopicsStudied;
      const pct = subjTotalItems > 0 ? Math.round((subjDoneItems / subjTotalItems) * 100) : 0;

      bySubject[subj.id] = {
        exercisesTotal: subjExTotal,
        exercisesSolved: subjExSolved,
        quizzesDone: subjQuizzes,
        topicsStudied: subjTopicsStudied,
        topicsTotal: topicsLen,
        topicsCount: topicsLen,
        percentage: pct
      };
    }

    const globalTotalItems = totalExercises + totalTopics * 2;
    const globalDoneItems = totalSolved + totalQuizzesDone + studiedTopicsCount;
    const globalPercentage = globalTotalItems > 0 ? Math.round((globalDoneItems / globalTotalItems) * 100) : 0;

    return {
      xp: state.xp,
      streakDays: state.streakDays,
      rank: getStudentRank(state.xp),
      totalExercises,
      totalSolved,
      totalTopics,
      studiedTopicsCount,
      pendingTopicsCount: pendingTopics.length,
      pendingTopics,
      totalQuizzesDone,
      quizResultsList,
      globalPercentage,
      bySubject,
      byLevel,
      recentActivity: state.recentActivity,
      lastVisited: state.lastVisited
    };
  }

  function addCalcHistory(expr, result) {
    state.calcHistory.unshift({ expr, result });
    if (state.calcHistory.length > 25) state.calcHistory.length = 25;
    saveState();
  }

  function clearCalcHistory() {
    state.calcHistory = [];
    saveState();
  }

  function resetAllProgress() {
    state = getDefaultState();
    saveState();
    return state;
  }

  ns.Storage = {
    getState: () => state,
    saveState,
    markTopicStudied,
    getExerciseAttemptState,
    recordHintUsed,
    recordFailedAttempt,
    recordExerciseSolved,
    recordQuizCompleted,
    computeProgressStats,
    addCalcHistory,
    clearCalcHistory,
    resetAllProgress
  };
})(window.MatInteractiva);
