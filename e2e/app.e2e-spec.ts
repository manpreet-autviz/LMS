import { LmsTemplatePage } from './app.po';

describe('Lms App', function() {
  let page: LmsTemplatePage;

  beforeEach(() => {
    page = new LmsTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
