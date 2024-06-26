/*  Generator de teste grila cu grad de dificultate dat GD. Fiecare intrebare are un grad de dificultate dat
si suma gradelor din test trebuie sa fie cat mai aproape de GD. */

class Question {
  private questionName: string;
  private difficultyLevel: number;

  constructor(name: string, difficulty: number) {
    this.questionName = name;
    this.difficultyLevel = difficulty;
  }

  getQuestionName(): string {
    return this.questionName;
  }

  getDifficulty(): number {
    return this.difficultyLevel;
  }
}

class Test {
  private questionsSet: Question[];

  constructor() {
    this.questionsSet = [];
  }

  getQuestionSet(): Question[] {
    return this.questionsSet;
  }

  addQuestion(question: Question): void {
    this.questionsSet.push(question);
  }

  getTotalDifficulty(): number {
    return this.questionsSet.reduce(
      (sum, question) => sum + question.getDifficulty(),
      0
    );
  }
}

class Generator {
  private difficultyLevel: number;
  private population: Test[];
  private crossoverRate: number = 0.7;
  private mutationRate: number = 0.2;

  constructor(difficultyLevel: number) {
    this.difficultyLevel = difficultyLevel;
    this.population = [];
  }

  private createInitialGeneration(
    popuationSize: number,
    questionPerTestSize: number
  ): void {
    for (let index = 0; index < popuationSize; index++) {
      let test: Test = new Test();
      for (
        let questionIndex = 0;
        questionIndex < questionPerTestSize;
        questionIndex++
      ) {
        test.addQuestion(this.createRandomQuestion(questionIndex));
      }
      this.population.push(test);
    }
  }

  private createRandomQuestion(index: number): Question {
    return new Question("Question " + (index + 1), this.getRandomNumber());
  }

  private getRandomNumber(): number {
    return Math.floor(Math.random() * 10) + 1;
  }

  private getFitness(test: Test): number {
    const totalDifficulty = test.getTotalDifficulty();
    return Math.abs(this.difficultyLevel - totalDifficulty);
  }

  private showActualPopulation(): void {
    this.population.forEach((test, index) => {
      console.error(`Test #${index + 1}`);
      console.log("Test total difficulty: ", test.getTotalDifficulty());
    });
  }

  private selectParentTournament(tournamentSize: number): Test {
    let tournamentWinner: Test =
      this.population[Math.floor(Math.random() * this.population.length)];
    for (let i = 0; i < tournamentSize; i++) {
      let randomTest =
        this.population[Math.floor(Math.random() * this.population.length)];
      if (this.getFitness(randomTest) < this.getFitness(tournamentWinner)) {
        tournamentWinner = randomTest;
      }
    }
    return tournamentWinner;
  }

  private crossover(parent1: Test, parent2: Test): Test {
    //Un singur punct  de taiere
    let child: Test = new Test();
    for (let i = 0; i < Math.floor(parent1.getQuestionSet().length / 2); i++) {
      child.addQuestion(parent1.getQuestionSet()[i]);
    }
    for (
      let j = Math.floor(parent2.getQuestionSet().length / 2);
      j < parent2["questionsSet"].length;
      j++
    ) {
      child.addQuestion(parent2.getQuestionSet()[j]);
    }
    return child;
  }

  private mutate(test: Test): void {
    let randomIndex: number = Math.floor(
      Math.random() * test.getQuestionSet().length
    );
    test.getQuestionSet()[randomIndex] = this.createRandomQuestion(randomIndex);
  }

  private evolveGeneration(tournamentSize: number): void {
    let newGeneration: Test[] = [];
    for (let test = 0; test < this.population.length; test++) {
      let parent1: Test = this.selectParentTournament(tournamentSize);
      let parent2: Test = this.selectParentTournament(tournamentSize);
      let child: Test;
      if (Math.random() < this.crossoverRate) {
        child = this.crossover(parent1, parent2);
      } else {
        child = Math.random() < 0.5 ? parent1 : parent2;
      }
      if (Math.random() < this.mutationRate) {
        this.mutate(child);
      }
      newGeneration.push(child);
    }
    this.population = newGeneration;
  }

  private stopEvolution(): boolean {
    let validTest: number = 0;
    this.population.forEach((test) => {
      if (test.getTotalDifficulty() === 100) {
        validTest++;
      }
    });
    if (validTest === this.population.length) {
      return true;
    }
    return false;
  }

  startAlgorithm(populationSize: number, questionPerTestSize: number): void {
    const startTime = new Date().getTime();
    console.error("Initial generation: ");
    console.error("--------------------------------------------------");
    this.createInitialGeneration(populationSize, questionPerTestSize);
    let iterationNumber: number = 0;
    this.showActualPopulation();
    console.error("--------------------------------------------------");
    while (!this.stopEvolution()) {
      generator.evolveGeneration(4);
      iterationNumber++;
    }
    console.error("Perfect generation: ");
    this.showActualPopulation();
    console.error("--------------------------------------------------");
    console.error("Number of iterations: ", iterationNumber);
    const endTime = new Date().getTime(); // End time
    const timeTaken = endTime - startTime;
    console.error(`Time taken: ${timeTaken} (ms)`);
  }
}

const generator = new Generator(100);
generator.startAlgorithm(10, 10);
