function getEditorRange() {
  const docx = document.getElementById("sphere-docx") as HTMLElement;

  docx.addEventListener("selectstart", (event: Event & { target: HTMLElement }) => {
    console.log(event, "selectstart")
  })

  docx.addEventListener("input", (event: InputEvent) => {
    console.log(event, "input")
  })

  docx.addEventListener("compositionstart", () => {
    console.log("compositionstart")
  })

  docx.addEventListener("compositionend", (event: InputEvent) => {
    console.log(event, "compositionend")
  })

  docx.addEventListener("click", (event: MouseEvent & { target: HTMLElement }) => {
    console.log(event, event.target.tagName, "click")
  })

  docx.addEventListener("keyup", (event: KeyboardEvent & { target: HTMLElement }) => {
    console.log(event, "keyup")
  })
}

type Mode = 'IR' | 'SV' | 'IV'

interface Docx {
  element: HTMLElement;
  iv?: IV;
}

class IV {
  public element: HTMLPreElement;
  public popover: HTMLDivElement;
  public selectPopover: HTMLDivElement;

  public constructor(public docx: Docx) {
    const divElement = document.createElement("div");
    divElement.className = "iv-docx";

    divElement.innerHTML = `<pre class="vditor-reset" placeholder="Hello World!"
    contenteditable="true" spellcheck="false"></pre>`;

    this.element = divElement.firstElementChild as HTMLPreElement;
    this.popover = divElement.firstElementChild.nextElementSibling as HTMLDivElement;
    this.selectPopover = divElement.lastElementChild as HTMLDivElement;

    console.log(this)
  }
}

class SphereDocx {
  public docx: Docx;

  public constructor(id: string | HTMLElement) {
    if (typeof id === 'string') {
      id = document.getElementById(id);
    }

    this.bootstrap(id)
  }

  public bootstrap(id: HTMLElement) {
    this.docx = {
      element: id,
    }

    this.docx.iv = new IV(this.docx)
  }
}

new SphereDocx('sphere-docx')